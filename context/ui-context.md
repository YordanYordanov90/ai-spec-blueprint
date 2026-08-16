# UI Context

## Product character

The product is a developer tool.

The UI should feel:

- precise
- technical
- calm
- deliberate
- architecture-oriented
- trustworthy
- inspectable

Avoid:

- playful consumer-app styling
- excessive gradients
- decorative animation without purpose
- generic AI-chat visual clichés
- dense enterprise dashboards in V1

## Visual inspiration

The current AI Blueprint website is useful visual inspiration for:

- strong developer-tool positioning
- dark technical presentation
- clear workflow visualization
- terminal/code motifs
- bordered information blocks
- visible stages and status
- restrained motion
- high information clarity

This is inspiration, not a design specification.

Do not copy:

- branding
- logo
- exact color palette
- exact typography
- exact layouts
- exact illustrations
- marketing copy
- component compositions

The project needs its own visual identity.

## Color direction

Exact colors are intentionally unresolved.

The product may use a different accent system from AI Blueprint.

Until branding is approved:

- use semantic design tokens
- avoid hardcoding a brand color throughout components
- keep contrast accessible
- ensure dark and light token strategy remains possible
- do not let a temporary accent become architecture

## Initial visual direction

A dark-forward developer-tool aesthetic is acceptable for early implementation, provided colors remain tokenized and replaceable.

The UI should remain usable with an eventual light theme if that is later approved.

## Main Web experience

The important product experience is not a generic full-screen chat.

A preferred conceptual layout is:

```text
+--------------------------+----------------------------------+
| Discovery / Grill Me     | Blueprint State                  |
|                          |                                  |
| Conversation             | Product         complete         |
| Focused questions        | Architecture    in progress      |
| Human answers            | Domain model    missing          |
|                          | Security        missing          |
|                          | UI              partial          |
+--------------------------+----------------------------------+
```

The user should be able to see that the project definition is becoming more complete as the interview progresses.

## Core surfaces

### Landing page

Goals:

- explain the problem quickly
- show the workflow
- demonstrate durable context
- show the relationship between Web, shared Core, and CLI
- provide a strong start action

### New project / Grill Me

Goals:

- minimize cognitive overload
- ask one focused question or one coherent group at a time
- show what has already been learned
- show why a material question matters when helpful
- allow correction of extracted assumptions

### Blueprint review

Should make structured decisions inspectable.

Possible sections:

- Product
- Users
- Goals
- Stack
- Architecture
- Domain
- UI
- Security
- AI
- Guardrails
- Features
- Unresolved Decisions

Approval/review state should be visually clear.

### Generated files

An IDE-like file explorer and document preview is a strong direction.

Concept:

```text
+-----------------------+--------------------------------------+
| AGENTS.md             | # Architecture                       |
| context/              |                                      |
|   project-overview    | ## Core boundaries                   |
|   architecture        | ...                                  |
|   schemas             |                                      |
|   code-standards      |                                      |
|   ui-context          |                                      |
|   ai-workflow-rules   |                                      |
|   progress-tracker    |                                      |
+-----------------------+--------------------------------------+
```

The preview should prioritize readability over imitating a real IDE perfectly.

## shadcn/ui usage

Good candidates:

- Button
- Card
- Tabs
- Accordion
- Dialog
- Sheet
- ScrollArea
- Tooltip
- Badge
- Progress
- Separator
- Textarea
- Input

Use only components that serve the interaction.

## Responsive behavior

The Web experience must be usable on mobile, but the product is developer-oriented and can prioritize desktop information density.

On smaller screens:

- stacked discovery and blueprint panels are acceptable
- preserve access to blueprint completeness
- avoid tiny split-pane layouts
- make generated file preview navigable

## Accessibility

Minimum expectations:

- semantic controls
- visible focus states
- keyboard-accessible dialogs and navigation
- sufficient contrast
- no meaning conveyed by color alone
- motion reduction where applicable
- readable code/Markdown typography

## Animation

Motion may communicate:

- progression
- status transitions
- panel changes
- newly completed blueprint sections

Avoid continuous decorative motion.

## Copy style

Product copy should be concise, technical, and specific.

Prefer:

"Review architecture before generation."

Avoid:

"Unlock the magic of AI-powered innovation."
