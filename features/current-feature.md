# F027 - Build Context Export

## Status

Ready after F026.

## Objective

Export the generated context package so a developer can place the files in a repository.

## Why this feature is next

The Web experience can now discover, review, and preview generated context. Export is the remaining V1 Web deliverable.

## In scope

- package the already generated artifacts
- let the user take the context files out of the Web session
- keep paths inside the validated artifact set

## Out of scope

Do not implement:

- CLI
- authentication or persistence
- writing into an arbitrary server filesystem
- GitHub repository mutation

## Architectural constraints

- Export the deterministic context package. Do not ask the model to rewrite documents.
- Constrain file names and export paths.
- Prevent generated paths from escaping their intended root.

## Acceptance criteria

- An approved generated package can be exported.
- Export does not invent additional document content.
- Path safety from the generated artifact model is preserved.

## Verification

Use the scaffolded project's actual commands:

- TypeScript/typecheck
- lint
- focused export checks
- inspect the Web export action
