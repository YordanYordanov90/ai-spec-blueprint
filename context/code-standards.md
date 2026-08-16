# Code Standards

## Language

TypeScript strict mode is required.

Avoid `any`.

If a third-party boundary forces an unknown value, prefer `unknown` and narrow it explicitly.

## Validation

Zod is required at trust boundaries.

Examples:

- AI structured output
- user input crossing server boundaries
- imported blueprint JSON
- environment/configuration parsing where appropriate

Prefer deriving TypeScript types from Zod rather than maintaining duplicate shapes.

## Next.js

Use App Router conventions.

Prefer Server Components by default.

Use Client Components only where client behavior is required.

Keep server-only code server-only.

Do not import server secrets or provider clients into Client Components.

## React

Prefer small, composable components with clear responsibilities.

Avoid turning every UI component into a reusable abstraction prematurely.

State should live as close as practical to the behavior that owns it.

Do not use global state merely to avoid passing a few props.

## shadcn/ui

Use shadcn/ui as a component foundation, not as a visual identity.

It is acceptable to customize composition, spacing, typography, borders, and tokens.

Do not make the product look like an unchanged shadcn demo.

## Tailwind CSS

Use Tailwind CSS for styling.

Prefer design tokens and consistent utility patterns over arbitrary one-off values.

Avoid unnecessarily long duplicated class strings. Extract a component or utility only when reuse or readability justifies it.

## Domain boundaries

Do not place canonical blueprint/domain logic inside React components.

Do not place Markdown generator logic inside route handlers.

Do not place OpenAI-specific behavior inside deterministic generators.

Prefer dependency direction:

```text
interface -> application/orchestration -> domain/core
```

Framework-independent domain/core code must not import from interface code.

## AI code

Centralize model/provider configuration.

Do not scatter model identifiers through the application.

Prompts should have a clear purpose and expected structured result.

Do not parse important AI responses with brittle string slicing when structured output is available.

All AI output that becomes application/domain state must be validated.

AI failures must be represented explicitly. Do not silently convert an invalid model response into a valid-looking blueprint.

## Generator code

Generators should be deterministic.

Prefer functions resembling:

```text
validated input -> string
```

or:

```text
validated input -> generated file object
```

Generated file metadata may include:

- relative path
- content
- document type

Never allow untrusted generated paths to escape the export root.

## Naming

Use descriptive domain names.

Preferred examples:

- `ProjectBlueprint`
- `ArchitectureDecision`
- `Guardrail`
- `GeneratedArtifact`
- `DiscoveryState`

Avoid generic names such as:

- `data`
- `info`
- `stuff`
- `handler2`
- `utils` for unrelated functions

## Files and modules

Prefer domain-oriented grouping.

Avoid giant miscellaneous utility modules.

A module should have an obvious reason to change.

## Error handling

Errors should retain useful context.

User-facing errors should not expose secrets or internal provider details.

AI schema validation errors should distinguish:

- provider/model failure
- invalid structured output
- application validation failure
- user input failure

Do not catch errors only to discard them.

## Comments

Use comments to explain why, constraints, or non-obvious tradeoffs.

Do not comment obvious syntax.

## Dependencies

Before adding a dependency:

1. verify the current stack does not already solve the problem
2. confirm the active feature requires it
3. prefer focused, maintained packages
4. avoid dependencies for trivial helpers

Do not introduce a database, auth library, workspace tool, or state library without an approved feature.

## Testing

Testing should focus on behavior and critical domain invariants.

Generator functions and schemas are high-value unit-test targets.

Avoid tests that only reproduce implementation details.

## Formatting and linting

Use the scaffolded project's existing formatter and lint configuration.

Do not replace configuration merely to match a personal preference.

## No speculative architecture

Do not implement extension points for hypothetical future providers, databases, or frameworks unless the active feature requires that abstraction.

Design clean boundaries, but keep the implementation proportional to current requirements.
