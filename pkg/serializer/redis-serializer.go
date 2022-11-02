package serializer

type RedisSerializer[T any] interface {
	Serialize(T) ([]byte, error)
	Deserialize([]byte) (*T, error)
}
