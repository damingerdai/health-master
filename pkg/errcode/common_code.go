package errcode

var (
	Success                   = NewError(200, "Success")
	ServerError               = NewError(10000000, "Internal Server Error")
	InvalidParams             = NewError(10000001, "Invalid Parameters")
	NotFound                  = NewError(10000002, "Not Found")
	NotFoundAuthorization     = NewError(10000003, "Authorization Header Missing")
	UnauthorizedAuthNotExist  = NewError(10000004, "Authentication Failed: User Not Found")
	UnauthorizedTokenError    = NewError(10000005, "Authentication Failed: Invalid Token")
	UnauthorizedTokenTimeout  = NewError(10000006, "Authentication Failed: Token Expired")
	UnauthorizedTokenGenerate = NewError(10000007, "Authentication Failed: Token Generation Failed")
	TooManyRequests           = NewError(10000009, "Too Many Requests")
	NotImplemented            = NewError(10000010, "Not Implemented")
	FailedToCreatePasswordResetToken = NewError(10000011, "Failed to Create Password Reset Token")
	InvalidOrExpiredToken            = NewError(10000012, "Invalid or Expired Token")
	ConfirmPasswordCannotBeEmpty     = NewError(10000013, "Confirm Password Cannot Be Empty")
	PasswordsDoNotMatch              = NewError(10000014, "Passwords Do Not Match")
	FailedToResetPassword            = NewError(10000015, "Failed to Reset Password")
	PasswordResetEmailSent           = NewError(10000016, "If the email exists, a password reset link has been sent.")
	PasswordResetSuccessfully        = NewError(10000017, "Password Reset Successfully")

	CreateUserError             = NewError(20000001, "Failed to Create User")
	CreateUplicateUserNameError = NewError(20000002, "Username Already Exists")

	CreateUserBloodPressureError = NewError(30000001, "Failed to Create Blood Pressure Record")
	ListUserBloodPressureError   = NewError(30000002, "Failed to Retrieve Blood Pressure Records")
	DeleteUserBloodPressureError = NewError(30000003, "Failed to Delete Blood Pressure Record")

	ListRoleError = NewError(40000001, "Failed to Retrieve Roles")

	CreateWeightRecordError       = NewError(50000001, "Failed to Create Weight Record")
	ListWeightRecordError         = NewError(50000002, "Failed to Retrieve Weight Records")
	DeleteDeleteWeightRecordError = NewError(50000003, "Failed to Delete Weight Record")

	CreateUserHeightError   = NewError(60000001, "Failed to Create Height Record")
	ListUserHeightError     = NewError(60000002, "Failed to Retrieve Height Records")
	DeleteUserHeightError   = NewError(60000003, "Failed to Delete Height Record")
	GetUserTemperatureError = NewError(60000004, "Failed to Retrieve Body Temperature Record")

	CreateUserTemperatureError = NewError(70000001, "Failed to Create Body Temperature Record")
	ListUserTemperatureError   = NewError(70000002, "Failed to Retrieve Body Temperature Records")
	DeleteUserTemperatureError = NewError(70000003, "Failed to Delete Body Temperature Record")
)
