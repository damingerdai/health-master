# avatar

2026-08-25, transformation engine, migrated.

## Changed

`components/ui/avatar.tsx`: replaced Radix Avatar parts with `@base-ui/react/avatar` parts while preserving classes. Leftover scan is clean.

## Left alone

No related files.

## Behavior changes

None known.

## Verify by hand

Check loaded image, fallback initials, and fallback delay.
