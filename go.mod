module github.com/damingerdai/health-master

go 1.22

require (
	github.com/gin-gonic/gin v1.9.1
	github.com/golang-jwt/jwt/v5 v5.0.0
	github.com/golang-migrate/migrate/v4 v4.16.2
	github.com/jackc/pgx-gofrs-uuid v0.0.0-20230224015001-1d428863c2e2
	github.com/jackc/pgx/v5 v5.5.4
	github.com/joho/godotenv v1.5.1
	github.com/juju/ratelimit v1.0.2
	github.com/mssola/user_agent v0.6.0
	github.com/pkg/errors v0.9.1
	github.com/redis/go-redis/v9 v9.3.0
	github.com/spf13/cobra v1.8.0
	github.com/spf13/viper v1.17.0
	github.com/swaggo/files v1.0.1
	github.com/swaggo/gin-swagger v1.6.0
	github.com/swaggo/swag v1.16.2
	github.com/xuri/excelize/v2 v2.8.0
	go.uber.org/zap v1.26.0
)

require (
	github.com/KyleBanks/depth v1.2.1 // indirect
	github.com/bytedance/sonic v1.10.1 // indirect
	github.com/cespare/xxhash/v2 v2.2.0 // indirect
	github.com/chenzhuoyu/base64x v0.0.0-20230717121745-296ad89f973d // indirect
	github.com/chenzhuoyu/iasm v0.9.0 // indirect
	github.com/dgryski/go-rendezvous v0.0.0-20200823014737-9f7001d12a5f // indirect
	github.com/fsnotify/fsnotify v1.6.0 // indirect
	github.com/gabriel-vasile/mimetype v1.4.2 // indirect
	github.com/gin-contrib/sse v0.1.0 // indirect
	github.com/go-openapi/jsonpointer v0.20.0 // indirect
	github.com/go-openapi/jsonreference v0.20.2 // indirect
	github.com/go-openapi/spec v0.20.9 // indirect
	github.com/go-openapi/swag v0.22.4 // indirect
	github.com/go-playground/locales v0.14.1 // indirect
	github.com/go-playground/universal-translator v0.18.1 // indirect
	github.com/go-playground/validator/v10 v10.15.4 // indirect
	github.com/goccy/go-json v0.10.2 // indirect
	github.com/gofrs/uuid/v5 v5.0.0 // indirect
	github.com/hashicorp/errwrap v1.1.0 // indirect
	github.com/hashicorp/go-multierror v1.1.1 // indirect
	github.com/hashicorp/hcl v1.0.0 // indirect
	github.com/inconshreveable/mousetrap v1.1.0 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20221227161230-091c0ba34f0a // indirect
	github.com/jackc/puddle/v2 v2.2.1 // indirect
	github.com/josharian/intern v1.0.0 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/klauspost/cpuid/v2 v2.2.5 // indirect
	github.com/leodido/go-urn v1.2.4 // indirect
	github.com/lib/pq v1.10.2 // indirect
	github.com/magiconair/properties v1.8.7 // indirect
	github.com/mailru/easyjson v0.7.7 // indirect
	github.com/mattn/go-isatty v0.0.19 // indirect
	github.com/mitchellh/mapstructure v1.5.0 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.2 // indirect
	github.com/mohae/deepcopy v0.0.0-20170929034955-c48cc78d4826 // indirect
	github.com/pelletier/go-toml/v2 v2.1.0 // indirect
	github.com/richardlehane/mscfb v1.0.4 // indirect
	github.com/richardlehane/msoleps v1.0.3 // indirect
	github.com/sagikazarmark/locafero v0.3.0 // indirect
	github.com/sagikazarmark/slog-shim v0.1.0 // indirect
	github.com/sourcegraph/conc v0.3.0 // indirect
	github.com/spf13/afero v1.10.0 // indirect
	github.com/spf13/cast v1.5.1 // indirect
	github.com/spf13/pflag v1.0.5 // indirect
	github.com/subosito/gotenv v1.6.0 // indirect
	github.com/twitchyliquid64/golang-asm v0.15.1 // indirect
	github.com/ugorji/go/codec v1.2.11 // indirect
	github.com/xuri/efp v0.0.0-20230802181842-ad255f2331ca // indirect
	github.com/xuri/nfp v0.0.0-20230819163627-dc951e3ffe1a // indirect
	go.uber.org/atomic v1.10.0 // indirect
	go.uber.org/multierr v1.10.0 // indirect
	golang.org/x/arch v0.5.0 // indirect
	golang.org/x/crypto v0.17.0 // indirect
	golang.org/x/exp v0.0.0-20230905200255-921286631fa9 // indirect
	golang.org/x/net v0.15.0 // indirect
	golang.org/x/sync v0.3.0 // indirect
	golang.org/x/sys v0.15.0 // indirect
	golang.org/x/text v0.14.0 // indirect
	golang.org/x/tools v0.13.0 // indirect
	google.golang.org/protobuf v1.31.0 // indirect
	gopkg.in/ini.v1 v1.67.0 // indirect
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
