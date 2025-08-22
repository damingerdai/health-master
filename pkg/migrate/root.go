package migrate

import (
	"fmt"
	"net/url"
	"os"
	"path"

	"github.com/damingerdai/health-master/pkg/util"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var cfgFile string

var rootCmd = &cobra.Command{
	Use:   "migrate",
	Short: "db migrate",
	Long:  "db migrate",
}

func init() {
	cobra.OnInitialize(initConfig)
	rootCmd.AddCommand(migrateCreateCmd)
	rootCmd.AddCommand(migrateUpCmd)
	rootCmd.AddCommand(migrateDownCmd)
	rootCmd.AddCommand(migrateFixCmd)
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func initConfig() {
	if cfgFile != "" {
		viper.SetConfigFile(cfgFile)
	} else {
		dir, err := os.Getwd()
		cobra.CheckErr(err)

		viper.AddConfigPath(path.Join(dir, "configs"))
		viper.SetConfigFile("yaml")
		viper.SetConfigName("db")
	}

	// TODO close the automatic bind env
	//viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err == nil {
		fmt.Fprintln(os.Stdin, "Using config file: ", viper.ConfigFileUsed())
	}
}

func getPostgresqlUrl() string {
	databaseUrl := os.Getenv("DATABASE_URL")
	if len(databaseUrl) == 0 {
		return buildPostgresqlUrl()
	}

	return databaseUrl
}

func buildPostgresqlUrl() string {
	var username string
	var password string
	var host string
	var port string
	var dbname string
	var sslmode bool
	viper.UnmarshalKey("Username", &username)
	viper.UnmarshalKey("Password", &password)
	viper.UnmarshalKey("Host", &host)
	viper.UnmarshalKey("Port", &port)
	viper.UnmarshalKey("Dbname", &dbname)
	viper.UnmarshalKey("SSL", &sslmode)

	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s", username, url.QueryEscape(password), host, port, dbname, util.If(sslmode, "required", "disable"))
}

func getMigratePath() string {
	migratePath := os.Getenv("MIGRATE_PATH")
	if len(migratePath) == 0 {
		return buildMigratePath()
	}

	return migratePath
}

func buildMigratePath() string {
	var migratePath string
	viper.UnmarshalKey("MigratePath", &migratePath)

	return migratePath
}
