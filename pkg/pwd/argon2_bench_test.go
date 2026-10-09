package pwd

import "testing"

// Run with: go test ./pkg/pwd -run '^$' -bench BenchmarkHashPassword -benchmem -count=3
// Each operation includes parameter validation, random salt generation, Argon2id,
// and PHC encoding. Parameter variants measure one change from the defaults;
// they are performance comparisons, not recommended password policies.
func BenchmarkHashPassword(b *testing.B) {
	for _, tc := range []struct {
		name   string
		modify func(*Argon2Params)
	}{
		{name: "Default"},
		{name: "Memory32MiB", modify: func(p *Argon2Params) { p.Memory = 32 * 1024 }},
		{name: "Memory128MiB", modify: func(p *Argon2Params) { p.Memory = 128 * 1024 }},
		{name: "Iterations1", modify: func(p *Argon2Params) { p.Iterations = 1 }},
		{name: "Parallelism1", modify: func(p *Argon2Params) { p.Parallelism = 1 }},
		{name: "Parallelism4", modify: func(p *Argon2Params) { p.Parallelism = 4 }},
	} {
		b.Run(tc.name, func(b *testing.B) {
			var params *Argon2Params
			if tc.modify != nil {
				copy := *DefaultParams
				tc.modify(&copy)
				params = &copy
			}
			b.ReportAllocs()
			for b.Loop() {
				if _, err := HashPassword("benchmark-password", params); err != nil {
					b.Fatal(err)
				}
			}
		})
	}
}

// go test ./pkg/pwd -run '^$'  -bench BenchmarkHashPasswordParallel -benchmem -cpu 1,2,4,8 -count=3
func BenchmarkHashPasswordParallel(b *testing.B) {
	b.ReportAllocs()

	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			if _, err := HashPassword(
				"benchmark-password",
				nil,
			); err != nil {
				b.Error(err)
				return
			}
		}
	})
}
