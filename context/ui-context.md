# UI Context

## Product character

AI Spec Blueprint is a developer tool for constructing a reliable project environment before implementation begins.

The UI should feel:

- precise
- technical
- calm
- deliberate
- architecture-oriented
- trustworthy
- inspectable

The product should visually communicate structure, architecture, context, and control rather than AI magic.

Avoid:

- generic AI-chat presentation
- glowing AI spheres, robots, and decorative sparkles
- excessive purple gradients
- playful consumer-app styling
- dense enterprise dashboards in V1
- decoration that does not clarify state or structure

## Core visual concept

The product's visual language is based on architecture being progressively constructed from approved project decisions.

The core sequence is:

```text
IDEA
  -> GRILL ME
  -> PROJECT UNDERSTANDING
  -> ARCHITECTURE
  -> GUARDRAILS
  -> PROJECT BLUEPRINT
  -> CONTEXT FILES
  -> AI AGENT IMPLEMENTATION
```

Recurring motifs may include:

- architecture nodes and dependency lines
- Markdown and context-file structures
- blueprint sections with explicit completeness
- approved, proposed, factual, and unresolved decisions
- guardrail enforcement metadata
- source-of-truth relationships
- code and schema-like labels

These motifs should make product state legible. They must not become a decorative diagramming layer with no relationship to product data.

## Design principles and references

The following products may inform principles only:

- Linear for hierarchy, typography, spacing, and workflow presentation
- v0 and Lovable for low-friction project starting experiences
- Raycast for a distinctive developer-tool identity
- Resend for visual restraint and technical clarity
- Cursor and Warp for developer-native minimalism
- Clerk for technical diagrams and code-oriented explanation
- the current AI Blueprint website for general developer-tool positioning

Do not copy their:

- layouts or card compositions
- branding or logos
- exact palettes
- typography combinations
- illustrations
- marketing copy

AI Spec Blueprint must develop its own visual language around progressively constructed architecture.

## Visual system

The initial direction is dark-forward, technical, and editorial:

- layered graphite surfaces
- quiet grid or drafting-line texture where it provides orientation
- restrained construction-signal accents
- strong display hierarchy paired with code/Markdown typography
- subtle borders and separators
- generous whitespace around dense technical content
- precise corners and small status details rather than soft consumer-app decoration

Exact brand colors remain unresolved. All reusable colors must use semantic design tokens.

Preferred semantic roles include:

- `background`
- `surface`
- `surface-elevated`
- `border`
- `foreground`
- `muted`
- `accent`
- `success`
- `warning`
- `danger`
- `code-surface`

Do not scatter raw brand colors through components. The token structure should support a later light theme without requiring component rewrites.

Use shadcn/ui as an accessible component foundation, not as the final visual identity. Composition, typography, spacing, borders, and status treatments must feel product-specific.

## Main Web experience

The Web application helps a developer:

1. describe a project
2. go through focused Grill Me discovery
3. see the project blueprint become structured
4. review architecture and material decisions
5. review guardrails and how they are enforced
6. inspect generated context files
7. export those files as a ZIP for a repository

The application must not become a full-screen generic chat interface.

The central product experience is a structured workspace. Desktop may present discovery and blueprint state side by side. The current implementation can retain local component state; a new global or persistent state architecture is not authorized by the visual redesign.

## Core surfaces

### Landing page

The landing page should immediately explain that AI Spec Blueprint prepares the environment around coding agents; it is not another coding agent.

It should communicate:

- a concise problem and value proposition
- a primary route into project creation and Grill Me
- the transformation from idea to durable context
- a simple architecture view showing the AI agent surrounded by approved context and constraints
- the generated context package
- guardrails as enforceable rules, not only prose

The workflow should be visible as:

```text
Describe -> Discover -> Architect -> Guard -> Generate -> Build
```

### Grill Me workspace

Grill Me is guided project architecture, not chat for the sake of chat.

The interface should show:

- what is already known
- the current focused question
- why the question matters
- what remains partial or unresolved
- how project completeness changes as facts are recorded

Preserve working conversational behavior where it exists. Do not replace it with static mockups.

A preferred desktop composition is:

```text
+-------------------------------+-------------------------------+
| GRILL ME                      | PROJECT BLUEPRINT             |
|                               |                               |
| focused question              | Product          complete     |
| why this matters              | Architecture     in progress  |
| user response                 | Security         unresolved   |
| extracted facts               | UI               partial      |
+-------------------------------+-------------------------------+
```

The exact composition may adapt to current routes and components.

### Blueprint completeness

Completeness must come from actual discovery state when available. Do not calculate fake percentages.

Allowed states include complete, partial, missing, unresolved, and not assessed. Each state must have a text label and a non-color-only indicator.

Static or demo states are acceptable only when clearly presented as product explanation rather than live project state.

### Architecture visualization

Architecture should be a recognizable part of the product identity.

Simple, product-specific node and connector compositions may explain relationships such as:

```text
Web UI
  -> Application Layer
  -> Blueprint Core
       |- Schemas
       |- Guardrails
       |- Generators
       `- Validation
```

The current UI task does not authorize a diagramming engine. User-project diagrams should only become data-driven when an active feature supports them.

### Guardrail cards

Guardrails have a distinctive reusable visual pattern. A card may show:

- title and category
- rule
- rationale or why it matters
- source of truth
- enforcement methods
- applicability or severity where existing data supports it
- approval status where existing data supports it

Do not expand the domain model solely to fill a visual card. Omit unavailable metadata or use clearly labeled explanatory examples on the landing page.

### Blueprint review

The review experience must distinguish:

- Fact: explicitly provided or reliably detected
- Proposal: an AI recommendation awaiting human review
- Approved: a human-approved durable decision
- Unresolved: a decision intentionally left open

States must differ by icon, label, or shape as well as color.

Blueprint sections may include Product, Users, Goals, Non-goals, Stack, Architecture, Domain, UI, Security, AI, Guardrails, Features, and Unresolved Decisions.

### Generated file explorer

Generated artifacts should use an IDE-inspired explorer and readable Markdown preview.

The explorer should communicate hierarchy without trying to recreate a full code editor. File navigation must remain keyboard accessible, and the preview should prioritize reading comfort.

```text
Blueprint
|- AGENTS.md
|- context/
|  |- project-overview.md
|  |- architecture.md
|  |- schemas.md
|  |- code-standards.md
|  |- ui-context.md
|  |- ai-workflow-rules.md
|  `- progress-tracker.md
`- decisions/
   `- ADR-001.md
```

The explorer previews generated artifacts and can export the approved package as a ZIP containing the Markdown files plus `blueprint.json`.

## Responsive behavior

Desktop may use higher information density and split workspace layouts.

On smaller screens:

- stack major discovery and blueprint areas
- keep blueprint status accessible
- avoid tiny split panels
- make file navigation horizontally safe and touch friendly
- preserve readable typography
- prevent horizontal overflow from paths, code, or diagrams
- keep primary actions visible in the natural content flow

## Motion

Use restrained motion only to communicate:

- blueprint sections becoming complete
- state transitions
- panel changes
- architecture nodes appearing
- generated artifacts becoming available

Avoid continuous ambient animation. Respect `prefers-reduced-motion`.

## Accessibility

Minimum expectations:

- semantic HTML and controls
- visible keyboard focus
- keyboard-accessible navigation, dialogs, and sheets
- sufficient contrast on every layered surface
- no color-only meaning
- descriptive labels
- readable code and Markdown typography
- reduced-motion support
- responsive type and touch targets

## Copy style

Product copy should be concise, technical, and specific.

Prefer:

"Review architecture before generation."

Avoid:

"Unlock the magic of AI-powered innovation."
