# display

2026-08-25, transformation engine, migrated.

## Changed

`components/ui/label.tsx`, `separator.tsx`, `avatar.tsx`: replaced Radix display primitives with native/Base UI equivalents while retaining classes. Leftover scan is clean.

## Left alone

No related files.

## Behavior changes

Label is now native HTML and Separator uses Base UI's semantic separator.

## Verify by hand

Check label association and horizontal/vertical separator rendering.
