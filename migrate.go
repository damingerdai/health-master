package main

import (
	cmdMigrate "github.com/damingerdai/health-master/cmd/migrate"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	cmdMigrate.Execute()
}
