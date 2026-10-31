package model

// APIResponseSwagger documents the envelope emitted by response.ToResponse.
type APIResponseSwagger[T any] struct {
	Code int `json:"code" example:"200"`
	Data T   `json:"data"`
}

// ErrorResponseSwagger documents the JSON emitted by the error response helpers.
type ErrorResponseSwagger struct {
	Code    int      `json:"code" example:"10000001"`
	Message string   `json:"message" example:"Invalid Parameters"`
	Details []string `json:"details,omitempty"`
}

// BloodPressureDeleteResultSwagger documents the deletion result payload.
type BloodPressureDeleteResultSwagger struct {
	Success bool `json:"success" example:"true"`
}
