package migrate

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/spf13/viper"
)

func TestGetPostgresqlURL(t *testing.T) {
	const configURL = "postgres://postgres:123456@localhost:5432/hm?sslmode=disable"
	const envURL = "postgres://user:p%40ss@localhost:5433/other?sslmode=require&connect_timeout=5"
	for _, tt := range []struct {
		name    string
		env     string
		config  string
		want    string
		wantErr bool
	}{
		{name: "config URL", config: "DatabaseUrl: " + configURL, want: configURL},
		{name: "environment overrides config", env: envURL, config: "DatabaseUrl: " + configURL, want: envURL},
		{name: "environment without config", env: envURL, want: envURL},
		{name: "missing URL", wantErr: true},
		{name: "blank URL", config: "DatabaseUrl: '   '", wantErr: true},
		{name: "legacy fields are not used", config: "Host: localhost\nPort: 5432\nUsername: postgres\nPassword: 123456\nDbname: hm\nSSL: false", wantErr: true},
	} {
		t.Run(tt.name, func(t *testing.T) {
			viper.Reset()
			t.Cleanup(viper.Reset)
			t.Setenv("DATABASE_URL", tt.env)
			viper.SetConfigType("yaml")
			if err := viper.ReadConfig(strings.NewReader(tt.config)); err != nil {
				t.Fatal(err)
			}
			got, err := getPostgresqlUrl()
			if tt.wantErr {
				if err == nil || !strings.Contains(err.Error(), "database URL is required") {
					t.Fatalf("expected missing DATABASE_URL error, got %v", err)
				}
				return
			}
			if err != nil || got != tt.want {
				t.Fatalf("getPostgresqlUrl() = %q, %v; want %q", got, err, tt.want)
			}
		})
	}
}

func TestInitConfigFindsDatabaseYAML(t *testing.T) {
	viper.Reset()
	t.Cleanup(viper.Reset)
	t.Setenv("DATABASE_URL", "")
	t.Setenv("MIGRATE_PATH", "")
	dir := t.TempDir()
	t.Chdir(dir)
	if err := os.Mkdir(filepath.Join(dir, "configs"), 0755); err != nil {
		t.Fatal(err)
	}
	const databaseURL = "postgres://postgres:123456@localhost:5432/hm?sslmode=disable"
	config := "DatabaseUrl: " + databaseURL + "\nMigratePath: file://./db/migrations\n"
	if err := os.WriteFile(filepath.Join(dir, "configs", "db.yaml"), []byte(config), 0600); err != nil {
		t.Fatal(err)
	}
	initConfig()
	got, err := getPostgresqlUrl()
	if err != nil || got != databaseURL {
		t.Fatalf("getPostgresqlUrl() = %q, %v; want configured URL", got, err)
	}
	if got := getMigratePath(); got != "file://./db/migrations" {
		t.Fatalf("getMigratePath() = %q; want configured path", got)
	}
	t.Setenv("MIGRATE_PATH", "file://./other/migrations")
	if got := getMigratePath(); got != "file://./other/migrations" {
		t.Fatalf("getMigratePath() = %q; want environment override", got)
	}
}
