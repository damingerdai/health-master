# sheet

2026-08-25, transformation engine, migrated.

## Changed

`components/ui/sheet.tsx`: Base UI Dialog Backdrop/Popup migration with side transitions. Leftover scan is clean.

## Left alone

None.

## Behavior changes

Side animation uses starting/ending transform styles.

## Verify by hand

Test each side, focus return, Escape, and outside click.
