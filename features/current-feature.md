# Current Feature

## No active feature

Status: ready for planning

F050 is complete. Do not begin another implementation feature until it is promoted from `features/backlog.md` and specified here.

## Most recently completed feature

### F050 - Harden import format and snapshot compatibility

- Status: complete
- Phase: Import compatibility hardening
- Surface: Blueprint Core / Web lifecycle

Added content sniffing and ZIP magic validation before import parsing, clear extension/content mismatch errors, centralized the current blueprint schema version, and made local snapshot restoration compatibility-aware with safe partial recovery.

## Verification

- lifecycle, workspace storage, generated-file, blueprint-review, export, and context checks
- TypeScript typecheck
- lint
- production Webpack build
