# Current Feature

## F039 - Add server-side AI abuse protection

- Status: in-progress
- Phase: Deployment protection
- Surface: Web / server-side AI boundary

## Objective

Protect public AI operations before provider calls with deployment-trusted identity, shared Vercel Firewall enforcement, structured retry guidance, and bounded request, context, and model-output sizes.

## Product decisions

- Vercel Firewall is the production enforcement boundary; process-local memory is not a production security control.
- The `ai-grill-me` rate-limit ID is checked with the current server-side request headers so Vercel supplies the deployment-trusted client identity.
- Production fails closed when the Firewall rule is missing or unavailable.
- Local development may explicitly use `AI_ABUSE_PROTECTION_MODE=local`; client-side controls do not provide protection.
- The AI provider receives bounded prompts and a bounded output-token budget.
- F039 does not add authentication, persistence, QStash, billing, or a second AI workflow.

## Scope

- Enforce the shared rate limit before both Grill Me provider calls.
- Return a typed rate-limit failure with `retryAfterSeconds` for rejected calls.
- Limit Server Action request bodies and individual user inputs.
- Bound serialized discovery state and compact older messages/facts before prompt construction.
- Set a model output-token cap in the shared AI model wrapper.
- Keep the change inside the server-side AI boundary and preserve the existing Grill Me UI flow.

## Acceptance criteria

- Both public AI actions check Vercel Firewall before loading or calling the provider.
- No process-local counter or client-only limit is used as the production control.
- Missing or unavailable production protection rejects the request safely.
- Oversized state returns a structured user-input failure before a provider call.
- Prompts remain within the configured prompt budget after context compaction.
- Rate-limit failures expose one clear retry instruction.
- Existing Web, AI, Blueprint Core, and CLI checks continue to pass.

## Verification

- Run `npm run typecheck`.
- Run `npm run lint`.
- Run the focused AI and Grill Me checks.
- Run the production build.

## Previous Feature

### F038 - Build Guardrail documentation library

- Status: in-progress
- Phase: Guardrail education and documentation
- Surface: Web

## Objective

Create a dedicated, public Web documentation area that explains the architectural guardrail topics that informed AI Spec Blueprint without placing the full source PDF into runtime prompts, Blueprint Core, generated context packages, or CLI output.

The documentation should help developers understand each concept, when it applies, when it does not apply, and how AI Spec Blueprint adapts it into a safer and more general product workflow.

## Product decisions

- Long-form guardrail education is a Web documentation concern, not durable project state.
- The source PDF remains research material and is not loaded, parsed, embedded, or transmitted at runtime.
- Documentation must use original wording, product-specific examples, and clear source attribution.
- Source concepts and AI Spec Blueprint adaptations must be visibly distinct.
- Conditional patterns such as normalized identity, protected operations, rate limiting, audit logging, plans, and tenant scoping must not be presented as universal defaults.
- The documentation may be inspired by established documentation information architecture, but it must retain AI Spec Blueprint's own visual identity and content structure.

## Scope

### Documentation routes

- Add a public Guardrail Library entry point at `/docs/guardrails`.
- Provide a stable route for individual topics, for example `/docs/guardrails/[slug]`.
- Make all guardrail topics discoverable from the library entry point.
- Add an appropriate Docs entry point from the existing public product navigation.

### Information architecture

Group topics into a small number of understandable sections such as:

- foundations
- architecture and source of truth
- server, security, and operational boundaries
- agent workflow and context engineering
- verification and continuous tightening

The library should support progressive reading rather than presenting one uninterrupted PDF-sized page.

### Topic inventory

The library must make these 24 source topics discoverable using AI Spec Blueprint terminology and original explanatory content:

1. Why architectural guardrails matter
2. The human as architect and director
3. Preparing the coding-agent environment
4. The cooperating guardrail stack
5. Pattern recognition before invention
6. Source-of-truth architecture
7. Strict TypeScript as compile-time enforcement
8. Normalized identity as a conditional adapter
9. Server-only boundaries
10. Protected operations as a conditional entry-point pattern
11. Enforcement beyond prompts
12. Rate limiting as inherited policy
13. Audit logging as an architectural guarantee
14. Client-safe mirrors of server contracts
15. Intentional gaps and controlled incompleteness
16. Inline micro-context near architecture hotspots
17. Search before invention
18. Compact `AGENTS.md` as a project map
19. Session limits and durable repository memory
20. Prompting after guardrails exist
21. Reuse-first and red-green prompting
22. Git control and human review
23. The define, implement, and tighten workflow
24. Conditional stack mapping and the guardrail checklist

Continuous tightening and feedback-loop guidance may be presented as a concluding product adaptation connected to topics 11 and 23 rather than as an additional source-course topic.

### Topic content

Each topic must provide, where applicable:

1. a concise definition
2. the problem it prevents
3. when it applies
4. when it does not apply
5. the source concept
6. the AI Spec Blueprint adaptation
7. a product-specific example
8. related topics

All course-derived material must be paraphrased. Do not copy source prose, tables, diagrams, branding, or page composition.

### UI and accessibility

- Reuse the existing product header, typography, semantic tokens, borders, and developer-tool visual language.
- Provide clear topic navigation and an in-page outline where it materially improves reading.
- Keep the main article width readable.
- Ensure navigation is keyboard accessible and has visible focus states.
- Preserve readable layouts on mobile without tiny multi-column panels or horizontal overflow.
- Use Server Components by default and introduce client state only where interaction requires it.

### Content ownership

- Store documentation content in repository-owned source files or typed static data that can be reviewed without the original chat or PDF.
- Do not add a content platform, database, CMS, authentication, or persistence layer.
- Do not add a new documentation dependency unless the existing stack cannot reasonably support the approved experience.

## Intentional gaps

The following capabilities are deliberately not part of F038:

- AI chat or AI-assisted discussion inside documentation pages
- applying a documentation topic directly to a `ProjectBlueprint`
- per-topic approval or rejection
- changing Grill Me discovery behavior
- adding CLI `explain`, `topics`, or documentation commands
- reproducing long-form documentation in terminal output
- changing ProjectBlueprint schemas, deterministic generators, export formats, or doctor behavior
- documentation search that requires a hosted service or new indexing infrastructure

These gaps preserve a clean boundary between education and project-state mutation. A later feature may connect the surfaces through reviewed proposals or stable topic links.

## Detailed implementation plan

### 1. Design direction - architectural field manual

The documentation experience should feel like a carefully indexed architectural field manual for coding-agent systems.

Retain the strongest information-architecture principles from the reference documentation experience:

- persistent grouped topic navigation
- one focused article at a time
- a compact in-page outline
- direct previous/next reading paths
- strong typography and generous article spacing
- clear code, table, note, and callout treatments

Express those principles through AI Spec Blueprint's own identity:

- dark graphite surfaces rather than a copied light documentation theme
- the existing drafting-grid background and construction-signal accent
- numbered topics presented as blueprint modules such as `06 / SOURCE OF TRUTH`
- precise square corners, fine borders, alignment marks, and restrained connector lines
- mono labels for navigation metadata and the existing product sans font for readable prose
- a recurring visual relationship of `SOURCE CONCEPT -> PRODUCT ADAPTATION`

The memorable product-specific detail should be a thin vertical "construction rail" beside the article. Section markers connect to this rail so the reader can see the concept being assembled from definition through application and example. It must remain subtle, semantic, and disabled or simplified on small screens.

### 2. Route and rendering architecture

Use App Router Server Components and statically render the documentation from repository-owned content.

Planned routes:

```text
app/
  docs/
    layout.tsx
    guardrails/
      page.tsx
      [slug]/
        page.tsx
```

Route responsibilities:

- `app/docs/layout.tsx` provides documentation metadata and the shared docs surface boundary.
- `/docs/guardrails` is the library index and orientation page.
- `/docs/guardrails/[slug]` renders one topic from the approved static catalog.
- `generateStaticParams` enumerates all approved topic slugs.
- `generateMetadata` provides a distinct title and description for every topic.
- Unknown slugs call `notFound()` rather than rendering an empty article.

Do not introduce MDX, a CMS, a database, a content API, or runtime filesystem reads for F038. Typed static content is sufficient for 24 known topics and keeps the build deterministic.

### 3. Repository-owned content model

Place long-form documentation outside Blueprint Core so the Web interface does not make educational copy part of the canonical project schema.

Planned structure:

```text
src/
  content/
    guardrails/
      types.ts
      categories.ts
      foundations.ts
      architecture.ts
      boundaries.ts
      workflow.ts
      verification.ts
      index.ts
```

Use a small TypeScript contract resembling:

```text
GuardrailTopic
|- number
|- slug
|- title
|- shortTitle
|- category
|- summary
|- applicability
|- definition
|- prevents[]
|- appliesWhen[]
|- avoidWhen[]
|- sourceConcept
|- productAdaptation
|- example
|- relatedSlugs[]
```

Rules for the catalog:

- exactly 24 topic records
- stable, human-readable slugs
- unique topic numbers and slugs
- category identifiers must resolve to one of the approved groups
- related-topic slugs must resolve to real topics
- content ordering comes from the approved topic number, never filesystem discovery
- content contains no source-PDF path, copied page text, or runtime dependency on the PDF
- applicability is expressed as `universal`, `conditional`, or `context-dependent`

Prefer five category modules over one very large file or 24 tiny modules. This keeps content review manageable without creating unnecessary abstractions.

### 4. Shared documentation components

Create focused Web-only components under `components/docs/`:

```text
components/docs/
  docs-shell.tsx
  docs-sidebar.tsx
  docs-mobile-navigation.tsx
  docs-outline.tsx
  guardrail-library-hero.tsx
  guardrail-topic-card.tsx
  guardrail-topic-article.tsx
  source-adaptation-panel.tsx
  applicability-badge.tsx
  related-topics.tsx
  topic-pagination.tsx
```

Component responsibilities:

- `DocsShell` owns the three-column reading layout and page landmarks.
- `DocsSidebar` renders grouped navigation, topic numbers, and `aria-current` state.
- `DocsMobileNavigation` exposes the same category/topic structure in a compact native disclosure; avoid duplicating navigation data.
- `DocsOutline` links only to headings present in the current topic.
- `GuardrailTopicCard` supports scanning the index without looking like a generic marketing card.
- `GuardrailTopicArticle` owns the consistent article sequence and semantic heading structure.
- `SourceAdaptationPanel` creates the most important comparison on every topic page.
- `ApplicabilityBadge` always includes text so meaning is not color-only.
- `RelatedTopics` and `TopicPagination` provide intentional onward navigation.

Keep these components presentational. They may consume the docs content model but must not import or mutate `ProjectBlueprint`, discovery state, export logic, or CLI workflows.

### 5. Product header integration

Extend the existing `ProductHeader` minimally so public surfaces can show a stable `Docs` link without losing their existing trailing content.

Expected behavior:

- product mark remains the left anchor
- `Docs` is visible in the public header and has an active state on documentation routes
- `Start a project` remains available as the primary product action where appropriate
- the landing-page status indicator may remain, but navigation and status must not compete for the same small-screen space
- no separate documentation brand or duplicate logo is introduced

Do not broadly redesign the landing page or onboarding header during F038.

### 6. Guardrail Library index page

The index should orient the reader before presenting the topic catalog.

Page sequence:

1. breadcrumb and `GUARDRAIL LIBRARY` label
2. title and concise explanation of source concepts versus product adaptations
3. small system diagram showing `CONCEPT -> APPLICABILITY -> ADAPTATION -> ENFORCEMENT`
4. category navigation with topic counts
5. five category sections containing all 24 numbered topics
6. a closing note explaining that reading a topic does not automatically add it to a project blueprint

Each topic card should show:

- topic number
- short title
- one-sentence summary
- applicability label
- category
- directional affordance to the article

Avoid a uniform wall of floating cards. Use a structured register: category heading on the left and an ordered stack or grid of topic rows on the right. Borders and numbering should provide rhythm.

An optional local filter may search the in-memory catalog by title, summary, and category. If implemented, isolate it in one small Client Component and keep the complete server-rendered topic index usable without JavaScript. Do not add a search dependency.

### 7. Topic detail page

Desktop composition:

```text
+----------------------+--------------------------------+------------------+
| GROUPED TOPIC NAV    | ARTICLE                        | ON THIS PAGE     |
| sticky               |                                | sticky           |
|                      | 06 / SOURCE OF TRUTH           | Definition       |
| Foundations          | title + summary                | Prevents         |
| Architecture         | applicability                  | Applies when     |
| Boundaries           |                                | Adaptation       |
| Workflow             | construction rail + sections  | Example          |
| Verification         |                                | Related topics   |
+----------------------+--------------------------------+------------------+
```

Article sequence:

1. topic number, category, title, summary, and applicability
2. definition
3. problem prevented
4. applies when
5. does not apply when
6. Source Concept and AI Spec Blueprint Adaptation comparison
7. product-specific example
8. related topics
9. previous/next topic navigation

The Source/Adaptation comparison should be the visual signature:

- Source Concept uses a quiet neutral/code surface.
- Product Adaptation uses a restrained accent edge and explicit label.
- A directional connector appears between them on wide screens.
- On narrow screens they stack in reading order.
- Conditional topics include a visible "Do not generate by default" note where appropriate.

Examples may use short code-like or schema-like blocks, but must not imply that displayed example code is copied from the source material or ready to execute.

### 8. Responsive behavior

Use three deliberate layout states rather than shrinking the desktop layout continuously.

Large desktop:

- persistent left navigation
- readable center column of approximately 42-48rem
- sticky right outline
- article remains visually dominant

Tablet and small desktop:

- persistent or compact left navigation depending on available width
- right outline is removed
- article remains centered and readable

Mobile:

- no fixed sidebars
- a compact topic/category disclosure appears beneath the product header
- breadcrumb and topic metadata wrap safely
- Source/Adaptation panels stack
- tables and code blocks scroll within their own containers
- previous/next navigation becomes a vertical pair of full-width links
- touch targets are at least 44px high

Validate at representative widths around 1440px, 1024px, 768px, and 390px.

### 9. Typography, color, and motion

Typography:

- retain Manrope for prose and IBM Plex Mono for structural labels
- use a restrained article type scale with comfortable `1.7-1.8` body line height
- keep line length below approximately 75 characters
- differentiate `h2` and `h3` through spacing and construction markers as well as size
- use mono typography sparingly for metadata, numbers, paths, and code

Color:

- use only existing semantic tokens unless a missing semantic role is proven
- preserve the graphite background, layered surfaces, and yellow-green construction accent
- use success, warning, and danger only for actual meaning
- maintain sufficient contrast for body copy, muted labels, borders, and focus rings

Motion:

- use the existing entrance motion only for the index hero or first article load
- use subtle border/background transitions for navigational hover states
- do not animate reading content while scrolling
- respect the existing reduced-motion rules

### 10. Content-writing pass

Write the 24 topics category by category so language remains consistent.

For every topic:

- paraphrase the source concept in original wording
- state whether it is universal, conditional, or context-dependent
- name the failure mode it prevents
- include at least one positive applicability condition
- include at least one non-applicability condition for conditional topics
- describe the AI Spec Blueprint adaptation without claiming the source required it
- include one project-specific example
- connect two or three related topics when relevant

Perform a final editorial pass for duplicated explanations. Shared ideas should link to their canonical topic rather than being repeated extensively.

### 11. Testing strategy

Add a focused `check:docs` verification script following the repository's existing lightweight check pattern.

Content checks:

- exactly 24 topics exist
- slugs and numbers are unique
- all categories are represented
- every related slug resolves
- every topic contains source concept, adaptation, applicability, and example content
- no topic contains the source PDF's local path

Route and UI checks:

- the library route exposes all category groups
- topic links use `/docs/guardrails/<slug>`
- dynamic routes generate all 24 static parameters
- unknown topics use the Next.js not-found path
- the public header exposes the Docs entry point
- navigation includes semantic labels and current-page state
- source and adaptation sections have explicit text labels

Regression checks:

- landing and onboarding checks continue to pass
- Blueprint Core and CLI boundary checks remain unchanged
- no docs component imports AI, export, discovery, or CLI modules

### 12. Visual and accessibility QA

Review the real rendered pages rather than relying only on source inspection.

Visual QA checklist:

- index hierarchy is immediately understandable
- sidebar and outline do not overpower the article
- all 24 topics are easy to scan
- long titles wrap without collisions
- code, notes, lists, and comparison panels share one visual grammar
- sticky regions do not cover the footer or header
- no horizontal page overflow exists
- the dark grid remains quiet behind long-form text

Accessibility QA checklist:

- one `h1` per page and ordered heading hierarchy
- skip link reaches the main article
- `header`, `nav`, `main`, `article`, and `aside` landmarks are labeled
- active navigation uses `aria-current="page"`
- keyboard focus remains visible in every navigation surface
- mobile disclosure works with keyboard and screen-reader semantics
- color is never the only applicability signal
- reduced-motion behavior is preserved

### 13. Implementation sequence

Implement in this order so each stage produces a reviewable result:

1. Define categories, the typed topic contract, and the complete 24-topic catalog.
2. Add invariant checks for topic count, slugs, numbering, categories, and relations.
3. Add docs routes, static parameters, metadata, and not-found behavior.
4. Build the shared shell, desktop navigation, mobile navigation, and outline.
5. Build the library index and topic cards/rows.
6. Build the topic article, Source/Adaptation panel, related topics, and pagination.
7. Integrate the Docs link into the existing product header.
8. Complete the content-writing and editorial consistency pass.
9. Add focused route/component checks and the `check:docs` package script.
10. Run typecheck, lint, focused checks, the existing Web regression checks, and production build.
11. Render and visually inspect representative index and topic pages at desktop, tablet, and mobile widths.
12. Correct accessibility, wrapping, sticky-layout, and contrast defects before marking F038 complete.

### 14. Expected file impact

Expected additions:

- docs layout and guardrail routes under `app/docs/`
- typed topic content under `src/content/guardrails/`
- documentation components under `components/docs/`
- focused documentation check files

Expected small modifications:

- `components/product/product-header.tsx` for the Docs navigation entry
- `package.json` for `check:docs`
- existing semantic styles only where the docs surface proves a reusable need

Files that should remain unchanged unless a concrete defect requires otherwise:

- ProjectBlueprint schemas
- deterministic context generators
- discovery and approval workflows
- export behavior
- CLI commands and package boundary
- persistence and authentication configuration

No ADR is expected because F038 adds a Web documentation surface without changing dependency direction, durable domain representation, external side effects, or approved infrastructure.

## Acceptance criteria

- `/docs/guardrails` renders as a dedicated documentation library using the established visual system.
- All 24 topics in the approved inventory are discoverable and categorized from the library entry point.
- Individual topic URLs are stable and directly navigable.
- Topic pages visibly distinguish source concepts from AI Spec Blueprint adaptations.
- Conditional guidance identifies when it should not be generated or applied.
- Documentation content is readable without access to the source PDF or the conversation that produced it.
- The application does not read or bundle the source PDF at runtime.
- Existing onboarding, review, generation, export, and CLI behavior remains unchanged.
- Desktop and mobile layouts are visually reviewed.
- Keyboard navigation, focus visibility, semantic headings, and contrast are checked.
- Relevant route or component checks are added.
- Typecheck, lint, focused checks, and the production build pass before completion.

## Verification

- Run `npm run typecheck`.
- Run `npm run lint`.
- Run focused checks for the documentation routes and navigation.
- Run the existing relevant Web checks.
- Run `npm run build`.
- Review the changed files for Blueprint Core or CLI dependency violations.
- Verify that no PDF, copied source text, authentication, persistence, or unrelated product behavior entered the implementation.
