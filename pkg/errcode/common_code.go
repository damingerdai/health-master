package errcode

var (
	Success                   = NewError(200, "成功")
	ServerError               = NewError(10000000, "服务内部错误")
	InvalidParams             = NewError(10000001, "入参错误")
	NotFound                  = NewError(10000002, "找不到")
	NotFoundAuthorization     = NewError(10000003, "请添加Authorization字段")
	UnauthorizedAuthNotExist  = NewError(10000004, "鉴权失败，找不到对应的用户")
	UnauthorizedTokenError    = NewError(10000005, "鉴权失败，Token 错误")
	UnauthorizedTokenTimeout  = NewError(10000006, "鉴权失败，Token 超时")
	UnauthorizedTokenGenerate = NewError(10000007, "鉴权失败，Token 生成失败")
	TooManyRequests           = NewError(10000009, "请求过多")

	CreateUserError = NewError(20000001, "创建用户失败")

	CreateUserBloodPressureError = NewError(30000001, "创建用户血压记录失败")
	ListUserBloodPressureError   = NewError(30000002, "获取用户血压记录失败")
)
