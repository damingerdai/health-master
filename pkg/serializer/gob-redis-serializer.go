package serializer

import (
	"bytes"
	"encoding/gob"
)

type GobRedisSerializer[T any] struct {
}

func (serializer GobRedisSerializer[T]) Serialize(t T) ([]byte, error) {
	// gob.Register(t)
	var buffer bytes.Buffer
	enc := gob.NewEncoder(&buffer)
	err := enc.Encode(&t)
	if err != nil {
		return nil, err
	}
	return buffer.Bytes(), nil
}

func (serializer GobRedisSerializer[T]) Deserialize(bs []byte) (T, error) {
	data := gob.NewDecoder(bytes.NewReader(bs))
	var t T
	err := data.Decode(&t)
	if err != nil {
		return t, err
	}
	return t, nil
}
