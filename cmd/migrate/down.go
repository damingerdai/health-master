package migrate

import (
	"fmt"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/spf13/cobra"
)

var migrateDownCmd = &cobra.Command{
	Use:   "down",
	Short: "migrate down command",
	Long:  "execute migrate down command",
	Run: func(cmd *cobra.Command, args []string) {
		m, err := migrate.New(getMigratePath(), getPostgresqlUrl())
		if err != nil {
			fmt.Fprintln(os.Stderr, err.Error())
			os.Exit(1)
		}
		defer m.Close()
		err = m.Down()
		if err != nil {
			fmt.Fprintln(os.Stderr, err.Error())
			os.Exit(1)
		}

		fmt.Fprintln(os.Stdin, "migrate down work")
	},
}
