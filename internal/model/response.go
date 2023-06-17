package model

type ListResponse[T any] struct {
	Data  []T   `json:"data"`
	Count int64 `json:"count"`
}
