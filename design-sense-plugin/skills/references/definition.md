# Derive the documents from the decisions

A requirement describes a result or constraint; it need not prescribe a widget. Preserve the supplied requirement's meaning when translating it. Mark invented business rules as assumptions.

Before implementing a substantial product, record the decisions needed for its representative workflow where the project's design decisions live. If no suitable home exists, create a small design note such as `DESIGN.md`. Separate user constraints, provisional choices and unresolved questions. Name the person's decision, the information needed in the first viewport, the main transitions and preserved state, and the observation that would challenge the proposed design.

When physical effort, perception or interrupted attention affects the workflow, use [conditions of use](../knowledge/use-context.md). In the same note, connect the relevant operating condition, known or assumed, to a design choice and an observation that could challenge it. Do not add a separate context dossier by default.

For a new visual system, include a concrete visual direction and the initial reusable roles with exact values or references to their authoritative definitions. Follow [design systems](design-systems.md) to connect them to implementation. A decision diary alone leaves the next screen's appearance unresolved; a token list alone leaves its purpose unresolved.

The record feeds composition, state handling and acceptance checks; it is not product copy. Combine the relevant decisions below, separating files only when different consumers or lifetimes warrant it:

| Decision | Useful artifact | What consumes it |
| --- | --- | --- |
| Who needs what outcome, scope and non-goals | Product brief / requirement map | Scenarios, acceptance criteria |
| Objects, relationships, ownership, invariants | Domain model | State model and component boundaries |
| Main job, alternate path, interruption and recovery | Task flows / state table | Navigation and interaction |
| Where work lives, which surface owns which action | Information architecture / region tree | Shell, landmarks, scroll and focus |
| What an action previews, commits, cancels and reverses | Interaction contract | Handlers, transactions, keyboard behavior |
| Reading order, emphasis, spacing and type roles | Visual specification | Tokens and rendered composition |
| Which complete workflows to deliver in what order | Implementation slices | Working increments |
| What was actually observed against each outcome | Verification record | Repairs and handoff |

Do not manufacture personas, research results, precision metrics, or elaborate deliverables to fill this table. Add research, content inventory, service blueprint, accessibility plan, responsive matrix, motion spec, or migration plan only when their decisions affect this product. Update the record as decisions change rather than generating parallel summaries.

For an underspecified product analogy, infer a coherent thin slice that preserves its identity. A visual editor needs a selection-dependent document model; a requirements workbench needs relationships and traceability; a store needs a credible purchase journey. Styling a generic form does not establish those models.

For critical work, connect requirement → scenario → model/state → surface/control → implementation → observed evidence. Stable identifiers can keep this compact. Example: “While editing several selected objects with different widths, show a mixed value; entering one width updates the intended set; one Undo restores every previous width.” This exposes both model and interface decisions without prescribing a framework.

Before implementation, challenge the proposed slice: can someone complete the promised job without pretending a control worked? Are a container and its children represented where the task depends on that relationship? Does any hidden assumption remove a defining workflow? Repair these gaps before polishing surfaces.
