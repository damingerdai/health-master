package migrate

import (
	"fmt"
	"os"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	"github.com/spf13/cobra"
)

var migrateUpCmd = &cobra.Command{
	Use:   "up",
	Short: "migrate up command",
	Long:  "execute migate up command",
	Run: func(cmd *cobra.Command, args []string) {
		m, err := migrate.New(getMigratePath(), getPostgresqlUrl())
		if err != nil {
			fmt.Fprintln(os.Stderr, err.Error())
			os.Exit(1)
		}
		defer m.Close()
		err = m.Up()
		if err != nil && err != migrate.ErrNoChange {
			fmt.Fprintln(os.Stderr, err.Error())
			os.Exit(1)
		}

		fmt.Fprintln(os.Stdin, "migrate up work")
	},
}
