package pwd

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"fmt"
	"strings"

	"github.com/damingerdai/health-master/pkg/errcode"
	"golang.org/x/crypto/argon2"
)

// ErrInvalidHashFormat indicates a malformed or unsupported stored password hash.
var ErrInvalidHashFormat = errors.New("invalid password hash format")

type Argon2Params struct {
	Memory      uint32
	Iterations  uint32
	Parallelism uint8
	SaltLength  uint32
	KeyLength   uint32
}

var DefaultParams = &Argon2Params{
	Memory:      64 * 1024, // 64 MB
	Iterations:  3,
	Parallelism: 2,
	SaltLength:  16,
	KeyLength:   32,
}

func isLegacyMD5(storedHash string) bool {
	if len(storedHash) != 32 {
		return false
	}
	_, err := hex.DecodeString(storedHash)
	return err == nil
}

func Authenticate(password, storedHash string) error {
	// Legacy MD5 accounts must reset their password before signing in.
	if isLegacyMD5(storedHash) {
		return errcode.ErrLegacyPasswordResetRequired
	}

	// Verify using Argon2id
	matched, err := VerifyPassword(password, storedHash)
	if err != nil {
		return err
	}
	if !matched {
		return errcode.ErrInvalidCredentials
	}

	return nil
}

func VerifyPassword(password, encodedHash string) (bool, error) {
	params, salt, expectedHash, err := decodePHCHash(encodedHash)
	if err != nil {
		return false, ErrInvalidHashFormat
	}

	computedHash := argon2.IDKey(
		[]byte(password),
		salt,
		params.Iterations,
		params.Memory,
		params.Parallelism,
		params.KeyLength,
	)

	if subtle.ConstantTimeCompare(expectedHash, computedHash) == 1 {
		return true, nil
	}

	return false, nil
}
func HashPassword(password string, params *Argon2Params) (string, error) {
	if params == nil {
		params = DefaultParams
	}

	if err := validateParams(params); err != nil {
		return "", err
	}
	salt := make([]byte, params.SaltLength)
	if _, err := rand.Read(salt); err != nil {
		return "", fmt.Errorf("generate password salt: %w", err)
	}

	hash := argon2.IDKey(
		[]byte(password),
		salt,
		params.Iterations,
		params.Memory,
		params.Parallelism,
		params.KeyLength,
	)

	return fmt.Sprintf(
		"$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version,
		params.Memory,
		params.Iterations,
		params.Parallelism,
		base64.RawStdEncoding.EncodeToString(salt),
		base64.RawStdEncoding.EncodeToString(hash),
	), nil
}

func decodePHCHash(encodedHash string) (params *Argon2Params, salt, hash []byte, err error) {
	vals := strings.Split(encodedHash, "$")
	if len(encodedHash) > 255 || len(vals) != 6 || vals[0] != "" || vals[1] != "argon2id" || vals[2] != fmt.Sprintf("v=%d", argon2.Version) {
		return nil, nil, nil, errors.New("invalid format")
	}

	params = &Argon2Params{}
	_, err = fmt.Sscanf(vals[3], "m=%d,t=%d,p=%d", &params.Memory, &params.Iterations, &params.Parallelism)
	if err != nil {
		return nil, nil, nil, err
	}

	if vals[3] != fmt.Sprintf("m=%d,t=%d,p=%d", params.Memory, params.Iterations, params.Parallelism) {
		return nil, nil, nil, errors.New("invalid parameters")
	}
	salt, err = base64.RawStdEncoding.Strict().DecodeString(vals[4])
	if err != nil {
		return nil, nil, nil, err
	}
	params.SaltLength = uint32(len(salt))

	hash, err = base64.RawStdEncoding.Strict().DecodeString(vals[5])
	if err != nil {
		return nil, nil, nil, err
	}
	params.KeyLength = uint32(len(hash))

	if err := validateParams(params); err != nil {
		return nil, nil, nil, err
	}
	return params, salt, hash, nil
}

// validateParams bounds the work and allocation accepted from stored hashes.
// These application limits include the default profile and fit varchar(255).
func validateParams(params *Argon2Params) error {
	if params.Parallelism == 0 || params.Parallelism > 16 ||
		params.Memory < 8*uint32(params.Parallelism) || params.Memory > 256*1024 ||
		params.Iterations == 0 || params.Iterations > 10 ||
		params.SaltLength < 8 || params.SaltLength > 64 ||
		params.KeyLength < 16 || params.KeyLength > 64 {
		return errors.New("invalid Argon2 parameters")
	}
	return nil
}
