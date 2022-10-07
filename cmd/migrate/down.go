package migrate

import (
	"fmt"
	"os"
	"strconv"

	"github.com/golang-migrate/migrate/v4"

	"github.com/spf13/cobra"
)

var migrateDownCmd = &cobra.Command{
	Use:   "down",
	Short: "migrate down command",
	Long:  "execute migrate down command",
	Args:  cobra.RangeArgs(0, 1),
	Run: func(cmd *cobra.Command, args []string) {
		m, err := migrate.New(getMigratePath(), getPostgresqlUrl())
		if err != nil {
			fmt.Fprintln(os.Stderr, err.Error())
			os.Exit(1)
		}
		defer m.Close()
		if len(args) == 1 {
			nString := args[0]
			n, err := strconv.Atoi(nString)
			if err != nil {
				fmt.Fprintln(os.Stderr, err.Error())
				os.Exit(1)
			}
			err = m.Steps(-n)
			if err != nil {
				fmt.Fprintln(os.Stderr, err.Error())
				os.Exit(1)
			}
		} else if len(args) == 0 {
			err = m.Down()
			if err != nil && err != migrate.ErrNoChange {
				fmt.Fprintln(os.Stderr, err.Error())
				os.Exit(1)
			}
		}

		fmt.Fprintln(os.Stdin, "migrate down work")
	},
}
