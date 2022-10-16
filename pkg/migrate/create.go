package migrate

import (
	"fmt"
	"os"
	"path"
	"time"

	"github.com/spf13/cobra"

	"github.com/damingerdai/health-master/pkg/util/files"
	"github.com/damingerdai/health-master/pkg/util/paths"
	"github.com/damingerdai/health-master/pkg/util/times"
)

var migrateCreateCmd = &cobra.Command{
	Use:   "create",
	Short: "create the migrate up/down sql file",
	Long:  "create the migrate up/down sql file",
	Args:  cobra.RangeArgs(1, 1),
	Run: func(cmd *cobra.Command, args []string) {
		filename := args[0]
		err := createCmd(filename)
		if err != nil {
			fmt.Fprintln(os.Stderr, err.Error())
		} else {
			fmt.Fprintln(os.Stdin, "migrate create work")
		}
	},
}

func createCmd(filename string) error {
	migrationPath, err := getMigrationPath("db", "migrations")
	if err != nil {
		return err
	}
	tv := times.TimeVersion(time.Now())
	sqlFileName := files.Kebabcase(filename)
	upSqlFileName := fmt.Sprintf("%s_%s.up.sql", tv, sqlFileName)
	downSqlFileName := fmt.Sprintf("%s_%s.down.sql", tv, sqlFileName)

	err = files.CreateFile(migrationPath, upSqlFileName)
	if err != nil {
		return err
	}
	err = files.CreateFile(migrationPath, downSqlFileName)
	if err != nil {
		return err
	}
	return nil
}

func getMigrationPath(elem ...string) (string, error) {
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}
	elem = append([]string{dir}, elem...)
	migrationPath := path.Join(elem...)

	isExist, err := paths.PathExists(migrationPath)
	if err != nil {
		return "", err
	}
	if !isExist {
		err = paths.CreateDir(migrationPath)
		if err != nil {
			return "", err
		}
	}

	return migrationPath, err
}
