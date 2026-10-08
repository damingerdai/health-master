package pwd

import (
	"encoding/base64"
	"errors"
	"strings"
	"testing"

	"github.com/damingerdai/health-master/pkg/errcode"
	"golang.org/x/crypto/argon2"
)

func TestPasswordRoundTrip(t *testing.T) {
	first, err := HashPassword("password", nil)
	if err != nil {
		t.Fatal(err)
	}
	second, err := HashPassword("password", nil)
	if err != nil {
		t.Fatal(err)
	}
	if first == second {
		t.Fatal("identical passwords must have independent random salts")
	}
	if len(first) > 255 {
		t.Fatal("hash exceeds database column")
	}
	for _, hash := range []string{first, second} {
		if err := Authenticate("password", hash); err != nil {
			t.Fatal(err)
		}
		if err := Authenticate("wrong", hash); !errors.Is(err, errcode.ErrInvalidCredentials) {
			t.Fatalf("wrong password: %v", err)
		}
	}
}

func TestAuthenticateLegacyAndMalformed(t *testing.T) {
	if err := Authenticate("password", "5f4dcc3b5aa765d61d8327deb882cf99"); !errors.Is(err, errcode.ErrLegacyPasswordResetRequired) {
		t.Fatalf("legacy password: %v", err)
	}
	valid := "$argon2id$v=19$m=65536,t=3,p=2$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
	for _, hash := range []string{
		"", strings.Repeat("z", 32), "prefix" + valid,
		strings.Replace(valid, "v=19", "v=16", 1),
		strings.Replace(valid, "t=3", "t=0", 1),
		strings.Replace(valid, "p=2", "p=0", 1),
		strings.Replace(valid, "p=2", "p=2junk", 1),
		strings.Replace(valid, "m=65536", "m=4294967295", 1),
		strings.Replace(valid, "t=3", "t=4294967295", 1),
		strings.Replace(valid, "m=65536", "m=1", 1),
		"$argon2id$v=19$m=65536,t=3,p=2$$",
		valid + "!",
	} {
		t.Run(hash, func(t *testing.T) {
			if err := Authenticate("password", hash); !errors.Is(err, ErrInvalidHashFormat) {
				t.Fatalf("malformed hash: %v", err)
			}
		})
	}
}

func TestHashPasswordRejectsInvalidParams(t *testing.T) {
	for _, mutate := range []func(*Argon2Params){
		func(p *Argon2Params) { p.Iterations = 0 },
		func(p *Argon2Params) { p.Parallelism = 0 },
		func(p *Argon2Params) { p.Memory = 0 },
		func(p *Argon2Params) { p.Memory = 4294967295 },
		func(p *Argon2Params) { p.SaltLength = 0 },
		func(p *Argon2Params) { p.KeyLength = 0 },
	} {
		params := *DefaultParams
		mutate(&params)
		if _, err := HashPassword("password", &params); err == nil {
			t.Fatal("accepted invalid parameters")
		}
	}
}

func TestExistingZeroSaltHashStillVerifies(t *testing.T) {
	// Hashes created before random salt generation was fixed remain usable.
	salt := make([]byte, 16)
	hash := argon2.IDKey([]byte("existing"), salt, 1, 64, 1, 32)
	encoded := "$argon2id$v=19$m=64,t=1,p=1$" + base64.RawStdEncoding.EncodeToString(salt) + "$" + base64.RawStdEncoding.EncodeToString(hash)
	if err := Authenticate("existing", encoded); err != nil {
		t.Fatal(err)
	}
}
