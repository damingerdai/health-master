package main

import (
	pkgMigrate "github.com/damingerdai/health-master/pkg/migrate"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	pkgMigrate.Execute()
}
