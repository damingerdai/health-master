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
	NotImplemented            = NewError(10000010, "功能未实现")

	CreateUserError             = NewError(20000001, "创建用户失败")
	CreateUplicateUserNameError = NewError(20000002, "用户名已经存在")

	CreateUserBloodPressureError = NewError(30000001, "创建用户血压记录失败")
	ListUserBloodPressureError   = NewError(30000002, "获取用户血压记录失败")
	DeleteUserBloodPressureError = NewError(30000003, "删除用户血压记录失败")

	ListRoleError = NewError(40000001, "获取角色失败")

	CreateWeightRecordError       = NewError(50000001, "创建用户体重记录失败")
	ListWeightRecordError         = NewError(50000002, "获取用户体重记录失败")
	DeleteDeleteWeightRecordError = NewError(50000003, "删除用户体重记录失败")

	CreateUserHeightError   = NewError(60000001, "创建用户身高记录失败")
	ListUserHeightError     = NewError(60000002, "获取用户身高记录失败")
	DeleteUserHeightError   = NewError(60000003, "删除用户身高记录失败")
	GetUserTemperatureError = NewError(60000004, "获取用户体温记录失败")

	CreateUserTemperatureError = NewError(70000001, "创建用户体温记录失败")
	ListUserTemperatureError   = NewError(70000002, "获取用户体温记录失败")
	DeleteUserTemperatureError = NewError(70000003, "删除用户体温记录失败")
)
