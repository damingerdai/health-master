package serializer

import (
	"bytes"
	"encoding/gob"
)

type MySlice[T int | float32] []T

func (s MySlice[T]) Sum() T {
	var sum T
	for _, value := range s {
		sum += value
	}
	return sum
}

type GobRedisSerializer[T any] struct {
}

func (serializer GobRedisSerializer[T]) Serialize(t T) ([]byte, error) {
	var buffer bytes.Buffer
	enc := gob.NewEncoder(&buffer)
	err := enc.Encode(t)
	if err != nil {
		return nil, err
	}
	return buffer.Bytes(), nil
}

func (serializer GobRedisSerializer[T]) Deserialize(bs []byte) (*T, error) {
	data := gob.NewDecoder(bytes.NewReader(bs))
	var t T
	err := data.Decode(&t)
	if err != nil {
		return nil, err
	}
	return &t, nil
}
