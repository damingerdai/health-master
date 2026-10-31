# Changelog

## [0.0.3-alpha.0] - 2026-10-31

### 🚀 Features

- *(web)* Restyle blood-pressure-new form with wellness design
- *(web)* Restyle blood-pressure table with wellness design
- *(web)* Restyle weight table with wellness design
- *(web)* Restyle weight-new form with wellness design
- *(web)* Restyle temperature table with wellness design
- *(web)* Restyle temperature form and add loading skeleton
- *(web)* Add blood pressure pagination
- *(web)* Add weight records pagination

### 🐛 Bug Fixes

- Propagate blood pressure creation database errors
- Use dedicated error code for blood pressure export
- *(deps)* Update module github.com/jackc/pgx/v5 to v5.12.0 (#365)

### 🚜 Refactor

- *(web)* Submit blood pressure records via form action
- *(web)* Submit weight records via form action

### 📚 Documentation

- Align blood pressure Swagger with API behavior

### 🎨 Styling

- *(web)* Apply mindful wellness styling to toaster

### ⚙️ Miscellaneous Tasks

- Publish container images from release workflow
- Release from dev and promote stable versions to main
## [0.0.2] - 2026-10-30

### 🚀 Features

- *(web)* Add global not-found page (#363)
## [0.0.2-rc.0] - 2026-10-29

### 🚀 Features

- Support token 2FA and scaffold password change endpoint (#357)
- Implement password changes with logging and per-user rate limits (#358)
- Add password settings and refresh profile UI (#362)

### 🐛 Bug Fixes

- *(deps)* Update module github.com/swaggo/files to v2 (#331)
- *(deps)* Update module github.com/swaggo/files to v2 (#359)

### ⚙️ Miscellaneous Tasks

- Update github.com/swaggo/files/v2 (#360)
## [0.0.2-beta.0] - 2026-10-28

### 🐛 Bug Fixes

- *(deps)* Update dependency cn to ^0.5.0 (#346)
- *(deps)* Update dependency @hookform/resolvers to v6 (#347)
- *(deps)* Update nextjs monorepo to v16.4.3 (#354)
## [0.0.2-alpha.0] - 2026-10-23

### 🚀 Features

- Bump nextjs v16.4.1 and enable rust react complier
- Add public home page and bypass next-auth protection for root route
- Redesign auth flows with mindful wellness UI and add skill (#343)
- *(web)* Redesign protected layouts with mindful wellness UI
- *(web)* Align dashboard page with landing preview design
- *(release)* Automate main releases with git-cliff

### 🐛 Bug Fixes

- *(release)* Restore version updates and changelog generation
- *(ci)* Normalize image version tags and publish latest
- *(deps)* Update dependency @tanstack/react-table to v9 (#319)
- *(deps)* Update nextjs monorepo to v16.4.2 (#323)
- *(deps)* Update module golang.org/x/crypto to v0.58.0 (#338)

### 🚜 Refactor

- Use useSyncExternalStore instead of useEffect in use mobile hooks
- Derive default timeRange from isMobile instead of useEffect in chart-area-interactive
- Use useWatch instead of form.watch in create-temperature-form

### ⚙️ Miscellaneous Tasks

- Add vercel react best partices skill
- Add geist skills
## [0.0.1] - 2026-10-09

### 🚀 Features

- Setup logger
- Setup config file support
- Setup postgreql support
- Add db migrate create work
- Migrate up work
- Migrate down work
- Add create user api
- Add find user api
- Migrate support steps feature
- Uplicate username error
- Add create token api
- Add web module
- *(web)* Add sidebar layout
- Login api work
- Add proected router
- Add get current user api
- User avatar will show the real username
- Add user profile dropdown list
- *(web)* Logout work
- Add creating user blood pressure api
- Add user blood pressure
- Add validate error for add user blood pressure
- Register view work
- Add errocde package
- Add server
- Add jwt middleware
- Add access log
- Add redis support
- Add redis cache to store user token
- *(web)* Bump nextjs 13 (#2)
- Add create_at format
- Add dev/prod http server (#3)
- Add redis serializer based on gob
- Prod server support listen http server run error
- The channel used with signal.Notify should be buffered
- Clear all toast instance when router changing
- Add redis service
- Access token store user id, not user name
- Add user profile view (#5)
- *(web)* Web support docker (#6)
- Add mobile picker based on chakra ui (#7)
- Add date picker input components
- User blood pressure need log date time
- User-blood-pressures api only list current user data
- *(web)* Add log date time
- Skip create user apo auth
- Add role model
- Bump go from 1.19.3 to 1.20 (#8)
- Update global theme
- Dashboard view need 4 cards module
- Use zap instead of logrus (#9)
- Add pgbouncer support (#10)
- Add dotenv file support (#11)
- Auto bind env vars (#12)
- Bump redis-go v9 (#14)
- Login view support toggle theme button
- Bump golang-jwt v5 (#56)
- *(deps)* Update alpine to v3.18 (#45)
- Add parse token api
- Set user users role for new user
- *(web)* Add google font link preconnect
- *(web)* Remove blue highlight color on onclike on buttons in chrome mobile
- *(db)* Set user blood pressure table with default created_at and updated_at with default current timestamp value
- User blood pressure list display 5 items and order by created at datetime desc
- Add pagination for user blood pressure table
- Use swr pagintaion feature
- *(web)* Configure the application to use the Edge Runtime
- *(web)* Configure the application to use the Edge Runtime
- *(web)* Add runtime env vars
- *(web)* Set table header font size large
- Allow user to delete user blood pressure record
- *(web)* Use current-user api
- Add ratelimit to protect server api
- *(web)* Update delete user blood pressure confirm modal to keep center placement
- Add aria-label for toggle theme button
- *(web)* Redirect to login view when user token is expired
- Update api route response to show method does not support
- Add BindEnvs to bind envs
- *(web)* Cache user blood pressure list number to avoid pagation change (#103)
- Remove redux code (#123)
- Migrate to pgx (#131)
- Add swagger ui support (#135)
- *(web)* Migrate to new layout (#141)
- *(web)* Update user blood pressure background color
- *(web)* Add button position to right
- Add a new api to download user blood pressures list to an excel file (#145)
- Add export current user boold pressure excel button
- *(web)* Use NEXT_PUBLIC_REACT_APP_BACKEND_DOWNLOAD_HOST to download excel file
- *(web)* Bump nextjs 14 (#152)
- *(web)* Use breadcrumb to show user blood pressure header
- *(web)* Use view transition api to switch theme mode
- *(deployments)* Bump postgres 16
- Update loading style
- Show user avatar in header right side
- Protect some important route
- Bump nextjs 14.2.2
- *(web)* Use gasp load theme animate
- *(web)* Set header z-index larger
- *(web)* Set header text font weight 700
- Add weight table schema (#194)
- *(web)* Root index view rediect to login view
- Add create weight record api (#196)
- *(web)* Add weight modal
- Add weight record work
- Add list one user weight records api
- Add weeight record list view
- *(web)* Display weight number
- Mutat weight records list after add a new weight record
- Weight records tablle show the user name column
- *(web)* Use GloablLoading to show loading status in auth required
- *(web)* Setup new background style with login and register view
- Support delete weight record
- Add paginater for weight record tables
- Create user api throw errcode error
- *(db)* Add table `user_heights` to supports heights api (#208)
- Create user height api work
- Bump nextjs 15 (#209)
- Add new web
- Add metrics exporter for prometheus
- Add loading view
- *(new-web)* Add registry from
- *(new-web)* Update regisry-from with full the form items
- *(new-web)* Add form validate for sgin up form
- *(new-web)* Add toaster for register user
- Registery from work
- *(nwe-wev)* Login view will call login api to fetch user
- *(new-web)* Add next auth
- *(new-web)* Add dashboard
- *(new-web)* Add new dashboard
- *(new-web)* New folder styles
- *(new-web)* Blood-pressure-new view
- *(new-web)* Blood-pressure-new support calling api
- *(new-web)* Add blood pressue table
- *(new-web)* Add wieght form
- *(new-web)* Show red text for Systolic Blood Pressure > 140 and Diastolic Blood Pressure > 90
- Add valiator support
- *(new-web)* Add wieght table
- Bump go 1.24.4
- *(new-web)* Add loading style in login form
- Bump go 1.25.0 (#220)
- Migrate db support DATABASE_URL and MIGRATE_PATH
- Add create the user temperatures table migration scripts (#222)
- *(ui)* Display user info in sidebar
- Create/find/list user temperature api (#225)
- Create/list user temperature ui (#226)
- Bump go 1.25.3
- *(new-web)* Bump nextjs 16
- Support database url configuration (#229)
- Switch to shadcn ui (#230)
- Upgrade nextjs 16.1.0
- *(web)* Add AppBreadcrumb for all page
- Update favicon logo
- Add user email field in db
- Bum go 1.25.6 and alpine:3.23
- Show user first/laste name
- Add new blood pressure record
- Add forget password
- Reset password api reday (#248)
- Add mail support
- Send mail when the reset passwork token is created
- *(web)* Add forget password success view
- *(web)* Bump sonner version and set description style more friendly
- Improve password reset flow and error logging (#249)
- Helm support smtp settings
- Helm support web deployment
- *(web)* Forget password success page use server side render
- Support email support
- Migrate github.com/go-mail/mail/v2 to send email
- Refactor password reset to use configurable frontend URL and async retry
- Reset password ui ready
- Create account with email
- *(ui)* Refactor weight and temperature modules and update registration form
- Redesign temperature module layout and improve empty states UI
- New dashboard view (#268)
- *(helm)* Support ingress
- Move to email/password
- Add user profile
- Remove leacy web application (#270)
- Add user profile loading view
- Trigger cache revalidation after health data mutations
- Add 2fa api support (#274)
- Bump go 1.27
- *(web)* Migrate ui components to base-ui (#281)
- *(web)* Add gravator support
- Harden two-factor authentication flow (#286)
- Add jaeger support (#269)
- Add height record tracking and creation
- Migrate password hashing to Argon2id and improve login errors (#333)
- *(release)* Automate version syncing and GitHub releases

### 🐛 Bug Fixes

- Update user api
- Login submit work
- Remove notification icon in header
- Close viper automateic env in migrate
- Update http code to 200
- Redirct to login view for token error
- *(web)* Fix web part build error
- List user_blood_pressure join user
- *(deps)* Update module github.com/spf13/viper to v1.15.0 (#40)
- Use hard code to skip cannot parse 'Redis.Port' as int error
- *(deps)* Update module github.com/spf13/cobra to v1.7.0 (#39)
- *(deps)* Update emotion monorepo to v11.11.0 (#31)
- *(deps)* Update dependency date-fns to v2.30.0 (#32)
- *(deps)* Update module github.com/redis/go-redis/v9 to v9.0.4 (#35)
- *(deps)* Update dependency framer-motion to v10.12.10 (#33)
- *(deps)* Update dependency swr to v2.1.5 (#34)
- *(deps)* Update dependency yup to ^0.32.0 (#36)
- *(deps)* Update module github.com/golang-jwt/jwt/v4 to v4.5.0 (#37)
- *(deps)* Update module github.com/mssola/user_agent to v0.6.0 (#38)
- Fix the display error for user dropdown in dashboard
- Login api only support post
- Throw error when fail to create a user
- *(deps)* Update dependency @chakra-ui/react to v2.6.1 (#44)
- *(deps)* Update dependency jotai to v2.1.0 (#48)
- *(deps)* Update module gorm.io/driver/postgres to v1.5.0 (#49)
- *(deps)* Update module github.com/golang-jwt/jwt/v4 to v5 (#55)
- *(deps)* Update dependency yup to v1 (#54)
- *(deps)* Update module gorm.io/gorm to v1.25.1 (#50)
- Show error info toast when fail to register new user
- Update login api to support new login response
- *(deps)* Update dependency framer-motion to v10.12.11 (#57)
- *(deps)* Update module gorm.io/driver/postgres to v1.5.2 (#62)
- *(deps)* Update dependency framer-motion to v10.12.12 (#60)
- *(deps)* Update dependency yup to v1.2.0 (#66)
- *(deps)* Update dependency framer-motion to v10.12.16 (#65)
- Make create user blodd pressure work
- User blood pressure log date show date and time
- Log date time will not show timezone
- *(web)* Fix the user meun do not display error after refresh the view
- *(deps)* Update module github.com/gin-gonic/gin to v1.9.1 [security] (#77)
- *(deps)* Update module github.com/spf13/viper to v1.16.0 (#75)
- *(deps)* Update module github.com/redis/go-redis/v9 to v9.0.5 (#73)
- *(deps)* Update module github.com/golang-migrate/migrate/v4 to v4.16.2 (#71)
- *(deps)* Update dependency @emotion/react to v11.11.1 (#79)
- *(deps)* Update dependency framer-motion to v10.12.17 (#83)
- *(deps)* Update dependency react-redux to v8.1.1 (#76)
- *(deps)* Update dependency react-icons to v4.10.1 (#72)
- Fix Property 'data' does not exist on type 'UserBloodPressures | { data: never[]; count: number; }
- *(deps)* Update dependency formik to v2.4.2 (#69)
- LogDateTime use user current default timezone when creating a new user blood pressure
- Remove 'req.headers,'
- *(deps)* Update dependency swr to v2.2.0 (#87)
- *(deps)* Update dependency jotai to v2.2.1 (#86)
- *(deps)* Update `@chakra-ui/react` from 2.6.1 to 2.7.1 (#85)
- *(deps)* Update dependency framer-motion to v10.12.18 (#94)
- *(web)* Nextjs server run node 20.3.0
- *(deps)* Update module gorm.io/gorm to v1.25.2 (#90)
- *(deps)* Update dependency jotai to v2.2.2 (#100)
- *(deps)* Update dependency framer-motion to v10.15.0 (#109)
- *(deps)* Update chakra-ui monorepo (#115)
- *(deps)* Update dependency swr to v2.2.2 (#122)
- Delete user blood pressure error response need more info (#92)
- *(deps)* Update dependency axios to v1.5.0 (#130)
- *(deps)* Update dependency framer-motion to v10.16.4 (#132)
- Fix layout error
- *(deps)* Update dependency axios to v1.6.0 (#143)
- *(deps)* Update dependency swr to v2.2.4 (#148)
- *(deps)* Update module github.com/jackc/pgx/v5 to v5.5.0 (#153)
- *(deps)* Update module github.com/redis/go-redis/v9 to v9.3.0 (#154)
- *(deps)* Update module go.uber.org/zap to v1.26.0 (#157)
- *(web)* Drawer mode only display on sm breackpoint
- *(web)* Set min height for golabl layout
- *(deps)* Update module github.com/spf13/viper to v1.17.0 (#156)
- *(deps)* Update module github.com/spf13/cobra to v1.8.0 (#155)
- *(deps)* Update dependency framer-motion to v10.16.5 (#167)
- *(deps)* Update module github.com/jackc/pgx/v5 to v5.5.2 (#177)
- *(deps)* Update module github.com/jackc/pgx/v5 to v5.5.4 [security] (#186)
- Fix 'location is not defined'
- *(deps)* Update dependency formik to v2.4.6 (#192)
- Set sider menu font weight smaller
- *(deps)* Update module github.com/spf13/cobra to v1.8.1 (#198)
- *(deps)* Update module github.com/swaggo/swag to v1.16.3 (#199)
- *(deps)* Update module github.com/xuri/excelize/v2 to v2.8.1 (#201)
- Save weight float value
- *(deps)* Update dependency next to v14.2.10 [security] (#206)
- *(api)* Add error details to invalid params response in AddWeightRecord
- *(deps)* Update dependency next [security] (#215)
- *(deps)* Update dependency next to v15.4.7 [security] (#221)
- *(deps)* Update module github.com/golang-jwt/jwt/v5 to v5.2.2 [security] (#216)
- GetUserByValidToken return email and mask email to support valiate user info
- Update reset password template expiration time
- *(deps)* Update module golang.org/x/crypto to v0.45.0 [security] (#250)
- Resolve useSearchParams() bailout in reset-password
- *(deps)* Update module github.com/swaggo/swag to v1.16.6 (#236)
- *(deps)* Update module github.com/swaggo/gin-swagger to v1.6.1 (#235)
- Update dashboard trend color
- Show user not found when user is not found
- *(deps)* Update module github.com/xuri/excelize/v2 to v2.11.0 [security] (#277)
- *(deps)* Update module github.com/jackc/pgx/v5 to v5.9.2 [security] (#279)
- *(web)* Disable standalone output on Vercel (#284)
- *(docker)* Grant nextjs user permissions for image cache directory
- *(web)* Add password visibility toggles to auth forms
- *(web)* Wrap user menu label in dropdown group
- Update sign-in correct login view path
- *(web)* Align profile loading layout with page
- *(web)* Rediect to sign-in view after reseting password
- *(deps)* Update dependency lucide-react to ^0.577.0 (#298)
- *(deps)* Update module github.com/golang-jwt/jwt/v5 to v5.3.1 (#300)
- *(deps)* Update module go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp to v1.45.0 [security] (#307)
- *(deps)* Update module go.uber.org/zap to v1.28.0 (#311)
- *(deps)* Update opentelemetry-go monorepo to v1.46.0 (#310)
- *(deps)* Update module github.com/golang-migrate/migrate/v4 to v4.20.1 (#301)
- *(deps)* Update module github.com/jackc/pgx/v5 to v5.11.0 (#302)
- *(deps)* Update module github.com/redis/go-redis/v9 to v9.22.0 (#303)
- *(deps)* Update module github.com/spf13/viper to v1.21.0 (#306)
- *(deps)* Update dependency lucide-react to v1 (#321)
- *(deps)* Update dependency cn to ^0.4.0 (#316)
- *(deps)* Update opentelemetry-go monorepo to v1.47.0 (#330)
- *(deps)* Update module go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin to v0.72.0 (#309)
- *(deps)* Update module github.com/spf13/cobra to v1.10.2 (#304)
- *(release)* Remove trailing blank lines from changelog
- *(deps)* Update module github.com/redis/go-redis/v9 to v9.23.0 (#329)
- *(release)* Push tags with PAT to trigger image publishing

### 💼 Other

- Add cmd folder to git repo
- Not ignore cmd folder
- Add login api
- Add docker-compose yaml
- Add docker support
- Bump go 1.19.3 (#4)
- Fix redis volumnes error
- Update replace info
- Add makefile support
- *(web)* Revert to standlone mode tu support docker image
- Bump gin from 1.8.1 to 1.9.0
- Add install githook shell scripts
- Bump go 1.20.1
- Remove `health-master` binary file
- Setup db k8s deployment (#13)
- Bump go 1.20.3 (#19)
- *(deps-dev)* Update nextjs monorepo to v13.3.4 (#27)
- *(deps-dev)* Update dependency sass to v1.62.1 (#25)
- *(deps-dev)* Update redis docker tag to v7.0.11 (#29)
- *(deps-dev)* Update types/react from 18.0.21 to 18.20 and types/react-dom from 18.0.6 to 18.2.1 (#17)
- *(deps)* Update chakra-ui from @chakra-ui/icon from 2.0.17 to 2.0.18 and @chakra-ui/react from 2.5.1 to 2.5.5 (#20)
- *(deps)* Update dependency axios to v1.4.0 (#21)
- *(deps)* Update dependency jotai to v2.0.4 (#22)
- *(deps-dev)* Update dependency eslint to v8.39.0 (#24)
- *(deps-dev)* Update dependency typescript to v4.9.5 (#26)
- *(deps-dev)* Update dependency @typescript-eslint/eslint-plugin to v5.59.2 (#23)
- *(deps)* Update dependency @reduxjs/toolkit to v1.9.5 (#30)
- *(deployment)* Add postgres k8s deployment file
- Add redis k3s deployment resource file
- Bump go 1.20.4
- Add k8s deployment file
- Add build docker powershell
- Add ingress resource file
- *(web)* Copy .env.example instead of .env
- Add deploy CI/CD
- Setps -> steps
- Io -> os
- Deply use github.Dockerfile
- Health-master-web -> health-master
- Bump golang v1.20.5
- Set pg default timezone to utf-8
- Revert "feat(web): configure the application to use the Edge Runtime"

This reverts commit ec167c812b426412dc80bbbecd789c03077de1be.
- *(web)* Close standalone output
- Revert "build(web): close standalone output"

This reverts commit 19d6957ccbf40ab2cb6fa7bfda34063cc3ac74ab.
- *(web)* Add build web docker image script
- *(deps-dev)* Bump @types/node from 18.16.18 to 20.3.3
- Bump go 1.21.0
- Update go version to 1.21 in go.mod
- *(web)* Add static build command
- Bump go 1.21.1
- Add air config file to hot restart
- Add HorizontalPodAutoscaler support
- *(deps)* Bump @babel/traverse from 7.22.5 to 7.23.2 in /web (#146)
- Bump golang 1.21.4
- Bump go to v1.21.5
- Add pgweb deployment file
- Bump go 1.21.6
- Bump redis 7.2.4-alpine3.19
- Set redis resources requests and limits
- Bump go 1.22.0
- Bump go 1.22.1
- Bump go from 1.22.2 to 1.22.4
- Next to 14.2.4
- Rebuild go mod file
- Bump go 1.22.5-alpine3.20
- Bump go 1.23.0
- Bump go to 1.23.1
- Bump go 1.23.3
- Bump go 1.24.3
- Bump docker compose file
- Revert "chore: Deploying Rancher via Helm in Private Kubernetes with Custom Domain Configuration"

This reverts commit 638b2ac4503bec89e4db5081a0f22f9c0cc63f1f.
- Bump go 1.25.1
- Bump go 1.25.5
- Add docker file
- Add build docker image shell scripts
- Add helm support
- Bump go 1.26.0
- *(web)* Add container support for web ui
- Add build adn import k3s shell script
- Add containerfile to support prune podman build
- Bump go 1.26.4
- Revert "chore: update image name to health-master-api"

This reverts commit 6167de25e672e1d0a0556a31f6f57e9ed837be2f.
- *(deps)* Add github.com/swaggo/files/v2 to module dependencies (#326)
- *(docker)* Bump mailpit image to v1.31.4 (#327)
- *(deps)* Remove unused indirect dependencies from go.mod
- *(deps)* Upgrade zod to v4 and hookform resolvers (#325)

### 🚜 Refactor

- Move package `migrate` from cmd to pkg
- Update response
- Add token create/parse token
- Add UserBloodPressureList as standlone component
- JwtSettingS use secretBytes to store byte arrays
- Setup head element to _document.tsx
- Use swr instead of redux
- Fetch current user from token
- Use useswr to fetch current user
- Rewrite the login view with new style (#138)
- *(web)* Switch to app router (#185)
- Rewrite login and register view
- Rewrite dashboard view
- Use sidenav global layout
- Blood-pressure view go back in app dir mode
- Blood-pressure view go back in app dir mode
- Remove leacy page (#195)
- Update sider style
- *(web)* Use Paginator commponent
- Update the way to set gin mode
- *(web)* Use new design for Blood Pressure view
- *(web)* Use new design for aside view
- *(web)* Use index instead of id in blood pressure table
- Improve config binding to support env vars without YAML keys
- Translate error messages from Chinese to English
- *(errcode)* Translate internal error logic and panic messages to English
- *(api)* Standardize password reset responses using unified errcode
- Decouple smtp username from sender address and optimize mailer
- Fetch blood pressure by server action
- Separate update request model and fix session synchronization (#276)
- *(web)* Rename NEXT_PUBLIC_REACT_APP_BACKEND_HOST to BACKEND_HOST
- Extract two-factor form with shadcn InputOTP
- Remove server-generated 2fa QR code images
- *(web)* Fetch temperature records on the server

### 📚 Documentation

- Add README file
- Add setup docker compose documents
- Add some sql on how to create a pg user

### 🎨 Styling

- Better eslint support
- Eslint fix
- Fix typo fix
- Add missing semicolon
- Fix style
- *(web)* Setup no-console rule
- Remove usless 'e'
- *(web)* Fix eslint for web
- *(web)* Style fix
- *(web)* Remove useless code
- *(web)* Format tsconfig.json
- Format error
- *(web)* Update eslint config
- *(web)* Fix eslint error
- *(ui)* Fix @typescript-eslint/no-unused-vars
- *(web)* Style format
- Fix lint error:
- *(web)* Increase main navigation spacing

### 🧪 Testing

- Add make test target and update 2fa assertions
- Add argo2 bench test

### ⚙️ Miscellaneous Tasks

- Init commit
- Ignore main.exe
- Add CI/CD
- Rename 'ubuntu-lastest' to 'ubuntu-latest'
- Fix bad substitution
- Remove yarn install
- Add docker build CI/CD
- Run build-end-docker afther end
- Add dependabot config
- Udpate defaul db name postgres
- Add renovate.json (#15)
- *(web)* Hide realy env file
- Update deploy dcoker name
- Add pre-push git hook
- Add node 20 and golang 1.20.5 support
- Add git attributes
- Kubectl set image for health-master-api container name
- Add kuma as moniter tool
- Add go fmt check
- Add commit-msg
- Ci(web)：only test node 20
- Swtich to edoburu/pgbouncer:1.20.1-p0
- Update pgbouncer config
- Bump go 1.21.3
- Add pgweb
- Add NEXT_PUBLIC_REACT_APP_BACKEND_DOWNLOAD_HOST
- *(deployment)* Add longhorm yaml file
- Rename deplyoments to deployments
- *(deployments)* Use longorn as storage class name
- *(deployments)* Postgres add subpath
- Fix 'tar can not open *.tar file for permission denied
- Bump go version to 1.22.o in go.mod
- Bump postgres from 15 to 16
- Add web prettier check in pre-commit git hooks
- Remove protected default page view
- Rebuild do mod file
- Update go sum file
- Add host dev command
- Add update deployment scripts
- *(db)* Switch migrate db name 'hm'
- Update go mod file
- Add podman script
- Add run  podman script
- Remove logger
- Support create system service to run podman pod
- Update create system service to create systemd service
- Add run shell script
- Fix build web application error
- Deploying Rancher via Helm in Private Kubernetes with Custom Domain Configuration
- Add 'Run Database Migrations' CI/CD
- Ignore new-web for renovate
- Add force in npm ci script
- Remove next lint command
- Update values.yaml
- Update swagger ui doc
- Bump docker compose service version
- Bump go 1.26.3
- *(helm)* Bump helm version to 1.0.1
- Move k8s deployments
- Update nextjs config
- Installs the shadcn skill
- Containerfile only support China mirror
- Update helm file to support ingress setting
- Bump go 1.26.4 and alpine3.24
- Bump node 26.3.0
- Add pg backup support (#275)
- Update deploy actions
- Bump go 1.26.5
- Helm support totp secret key
- Init claude
- Add shadcn ui skills
- Add log in forget password
- Bump go version to 1.27.0 (#282)
- *(ci)* Bump github actions versions (#283)
- *(deploy)* Add kustomize base for k8s deployment
- Add deploy-dev workflow to build and push images to dev registry
- *(deploy-dev)* Configure insecure HTTP registry for buildx push
- *(deploy-dev)* Create /etc/docker dir before writing daemon.json
- *(deploy-dev)* Write buildkitd config to file before passing to buildx
- Update deploy into dev pipline
- Use buildkitd-config-inline to setup docker buildx
- Update 2fa layout
- *(web)* Upgrade shadcn components to base-nova
- Update web profile form layout
- Update UI components and authenticator QR rendering
- *(web)* Migrate frontend tooling from npm to bun (#292)
- Remove renovate ignorePaths
- Add mailpit
- Support manual multi-platform publishing to GHCR and Docker Hub
- Update image name to health-master-api
- Publish images automatically for semantic version tags
