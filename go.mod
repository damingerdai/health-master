module github.com/damingerdai/health-master

go 1.20

require (
	github.com/gin-gonic/gin v1.9.0
	github.com/golang-migrate/migrate/v4 v4.15.2
	github.com/sirupsen/logrus v1.9.0
	github.com/spf13/cobra v1.5.0
	github.com/spf13/viper v1.13.0
	gorm.io/driver/postgres v1.3.10
	gorm.io/gorm v1.23.10
)

require (
	github.com/bytedance/sonic v1.8.2 // indirect
	github.com/cespare/xxhash/v2 v2.1.2 // indirect
	github.com/chenzhuoyu/base64x v0.0.0-20221115062448-fe3a3abad311 // indirect
	github.com/dgryski/go-rendezvous v0.0.0-20200823014737-9f7001d12a5f // indirect
	github.com/fsnotify/fsnotify v1.5.4 // indirect
	github.com/gin-contrib/sse v0.1.0 // indirect
	github.com/go-playground/locales v0.14.1 // indirect
	github.com/go-playground/universal-translator v0.18.1 // indirect
	github.com/go-playground/validator/v10 v10.11.2 // indirect
	github.com/go-redis/redis/v8 v8.11.5 // indirect
	github.com/goccy/go-json v0.10.0 // indirect
	github.com/golang-jwt/jwt/v4 v4.4.2 // indirect
	github.com/hashicorp/errwrap v1.1.0 // indirect
	github.com/hashicorp/go-multierror v1.1.1 // indirect
	github.com/hashicorp/hcl v1.0.0 // indirect
	github.com/inconshreveable/mousetrap v1.0.1 // indirect
	github.com/jackc/chunkreader/v2 v2.0.1 // indirect
	github.com/jackc/pgconn v1.13.0 // indirect
	github.com/jackc/pgio v1.0.0 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgproto3/v2 v2.3.1 // indirect
	github.com/jackc/pgservicefile v0.0.0-20200714003250-2b9c44734f2b // indirect
	github.com/jackc/pgtype v1.12.0 // indirect
	github.com/jackc/pgx/v4 v4.17.2 // indirect
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/jinzhu/now v1.1.5 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/klauspost/cpuid/v2 v2.2.4 // indirect
	github.com/leodido/go-urn v1.2.2 // indirect
	github.com/lib/pq v1.10.2 // indirect
	github.com/magiconair/properties v1.8.6 // indirect
	github.com/mattn/go-isatty v0.0.17 // indirect
	github.com/mitchellh/mapstructure v1.5.0 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.2 // indirect
	github.com/mssola/user_agent v0.5.3 // indirect
	github.com/pelletier/go-toml v1.9.5 // indirect
	github.com/pelletier/go-toml/v2 v2.0.7 // indirect
	github.com/spf13/afero v1.9.2 // indirect
	github.com/spf13/cast v1.5.0 // indirect
	github.com/spf13/jwalterweatherman v1.1.0 // indirect
	github.com/spf13/pflag v1.0.5 // indirect
	github.com/subosito/gotenv v1.4.1 // indirect
	github.com/twitchyliquid64/golang-asm v0.15.1 // indirect
	github.com/ugorji/go/codec v1.2.10 // indirect
	go.uber.org/atomic v1.10.0 // indirect
	golang.org/x/arch v0.2.0 // indirect
	golang.org/x/crypto v0.6.0 // indirect
	golang.org/x/net v0.7.0 // indirect
	golang.org/x/sys v0.5.0 // indirect
	golang.org/x/text v0.7.0 // indirect
	google.golang.org/genproto v0.0.0-20220926220553-6981cbe3cfce // indirect
	google.golang.org/grpc v1.49.0 // indirect
	google.golang.org/protobuf v1.28.1 // indirect
	gopkg.in/ini.v1 v1.67.0 // indirect
	gopkg.in/yaml.v2 v2.4.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)

replace (
	github.com/damingerdai/health-master/cmd => ./cmd
	github.com/damingerdai/health-master/global => ./global
	github.com/damingerdai/health-master/internal/api => ./internal/api
	github.com/damingerdai/health-master/internal/db => ./internal/db
	github.com/damingerdai/health-master/internal/logger => ./internal/logger
	github.com/damingerdai/health-master/internal/middleware => ./internal/middleware
	github.com/damingerdai/health-master/internal/model => ./internal/model
	github.com/damingerdai/health-master/internal/repository => ./internal/repository
	github.com/damingerdai/health-master/internal/routers => ./internal/routers
	github.com/damingerdai/health-master/internal/service => ./internal/service
	github.com/damingerdai/health-master/pkg/errcode => ./pkg/errcode
	github.com/damingerdai/health-master/pkg/migrate => ./pkg/migrate
	github.com/damingerdai/health-master/pkg/serializer => ./pkg/serializer
	github.com/damingerdai/health-master/pkg/server => ./pkg/server
	github.com/damingerdai/health-master/pkg/setting => ./pkg/setting
	github.com/damingerdai/health-master/pkg/util => ./pkg/util
	github.com/damingerdai/health-master/pkg/util/files => ./pkg/util/files
	github.com/damingerdai/health-master/pkg/util/paths => ./pkg/util/paths
	github.com/damingerdai/health-master/pkg/util/times => ./pkg/util/times
	github.com/damingerdai/health-master/pkg/util/tokens => ./pkg/util/tokens
)
