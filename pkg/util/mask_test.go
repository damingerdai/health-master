package util

import "testing"

func TestMaskEmail(t *testing.T) {
	tests := []struct{
		in string
		want string
	}{
		{"damingerdai@gmail.com", "d*********i@gmail.com"},
		{"ab@c.com", "a*@c.com"},
		{"a@b.com", "*@b.com"},
		{"", ""},
		{"invalid", "invalid"},
		{"john.doe+tag@gmail.com", "j**********g@gmail.com"},
	}

	for _, tc := range tests {
		got := MaskEmail(tc.in)
		if got != tc.want {
			t.Errorf("MaskEmail(%q) = %q; want %q", tc.in, got, tc.want)
		}
	}
}
