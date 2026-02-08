package util

import "strings"

// MaskEmail returns a masked version of the given email, keeping the first
// and last character of the local-part and replacing the middle with '*'.
// Examples:
//  - "damingerdai@gmail.com" -> "d*********i@gmail.com"
//  - "ab@c.com" -> "a*@c.com"
//  - "a@b.com" -> "*@b.com"
func MaskEmail(email string) string {
	if email == "" {
		return ""
	}

	parts := strings.SplitN(email, "@", 2)
	if len(parts) != 2 {
		// Not a valid email, return as-is
		return email
	}

	local := parts[0]
	domain := parts[1]

	r := []rune(local)
	n := len(r)
	if n == 0 {
		return "@" + domain
	}
	if n == 1 {
		return "*" + "@" + domain
	}
	if n == 2 {
		return string(r[0]) + "*" + "@" + domain
	}

	return string(r[0]) + strings.Repeat("*", n-2) + string(r[n-1]) + "@" + domain
}
