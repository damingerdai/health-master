package migrate

import (
	"fmt"
	"os"
	"strconv"

	"github.com/golang-migrate/migrate/v4"
	"github.com/spf13/cobra"
)

var migrateFixCmd = &cobra.Command{
	Use:   "fix",
	Short: "migrate fix command",
	Long:  "execute fix dirty database version command",
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		m, err := migrate.New(getMigratePath(), getPostgresqlUrl())
		if err != nil {
			fmt.Fprintln(os.Stderr, err.Error())
			os.Exit(1)
		}
		defer m.Close()
		nString := args[0]
		n, err := strconv.Atoi(nString)
		if err != nil {
			fmt.Fprintln(os.Stderr, err.Error())
			os.Exit(1)
		}
		err = m.Force(n)
		if err != nil {
			fmt.Fprintln(os.Stderr, err.Error())
			os.Exit(1)
		}
		fmt.Fprintln(os.Stdin, "migrate fix work")
	},
}
