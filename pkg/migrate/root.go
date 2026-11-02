package migrate

import (
	"errors"
	"fmt"
	"os"
	"path"
	"strings"

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
		viper.SetConfigType("yaml")
		viper.SetConfigName("db")
	}

	if err := viper.ReadInConfig(); err == nil {
		fmt.Fprintln(os.Stdin, "Using config file: ", viper.ConfigFileUsed())
	}
}

func getPostgresqlUrl() (string, error) {
	databaseUrl := os.Getenv("DATABASE_URL")
	if len(databaseUrl) == 0 {
		databaseUrl = viper.GetString("DatabaseUrl")
	}
	if strings.TrimSpace(databaseUrl) == "" {
		return "", errors.New("database URL is required: set DATABASE_URL or configure DatabaseUrl in configs/db.yaml")
	}
	return databaseUrl, nil
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
