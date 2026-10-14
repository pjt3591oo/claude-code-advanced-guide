---
name: design-sense
description: "Design, build and review interfaces, or reconstruct an existing interface and component system from source. Use for product design, substantial UI changes, interactive prototypes, design reviews, or faithful UI reconstruction."
---

# Design Sense

Design a coherent visual and behavioral system around the user's work. Judge it with real content in the running interface.

For review-only requests, leave artifacts unchanged and report findings, evidence and limits. Apply implementation steps when changes are requested or already authorized.

For faithful reconstruction, source-derived component systems or framework ports that must preserve an existing UI, read [source reconstruction](references/source-reconstruction.md) before choosing primitives or authoring components. Use its source-to-implementation comparison process; general design guidance does not authorize reinterpretation. For inspiration or a requested redesign, use the design process below. Infer the intent from the request and prior commitments; ask only when a consequential ambiguity remains. Keep any authorized substitutions limited to their stated scope.

Read the requirements and existing UI, code and design decisions. Keep local changes local. Before implementing a new product or substantial redesign, use [definition](references/definition.md) to record the decisions its representative workflow needs. Ask about consequential unresolved choices; resolve reversible ones yourself.

For new design work or critique, read the [design judgment index](knowledge/index.md). Use its shared concepts, then follow only the links relevant to the decision. Preserve the user's visual commitments; test assumptions introduced by generated drafts.

For design implementation, inspect whether a usable design system exists. If none exists, establish and verify it first using [design systems](references/design-systems.md), then continue into the requested screens without stopping at the system deliverable. Use React and StyleX for newly created design systems and interfaces unless the user specifies a different stack. For an existing application, preserve its host stack unless migration is requested; make any incompatibility with this preference explicit.

Read the reference for the work at hand:

- Screen composition and visual review: [composition](references/composition.md).
- Interfaces with repeated components, including workflow-wide reviews: [design systems](references/design-systems.md).
- Stateful controls and transactions: [interaction](references/interaction.md); before choosing or replacing fields, pickers, overlays or compound controls, read [component behavior](references/component-behavior.md) for capability selection and their value, focus and dismissal contract.
- Feedback, transitions and scroll choreography: [motion](references/motion.md).
- Canvas, node or timeline editing: [editors](references/editors.md).
- Operational and data applications: [work apps](references/work-apps.md).
- Reading, discovery and commerce: [content](references/content.md).
- Touch and mobile navigation: [mobile](references/mobile.md).

For a new or redesigned interface, use the recorded decisions to build a representative workflow end to end. Before expanding it, render its first working screen and a contrasting state with realistic content; evaluate them through [composition](references/composition.md). Identify the decision the person can make in the first viewport and the evidence available for it; revise content that displaces that work without helping it. Expression earns space through the subject or the requested experience. Reuse the project's system and connect new recurring roles to actual styles and components. Try uncertain interactions early. For “like X,” inspect comparable workflows and states; distinguish observation from inference.

When observation contradicts a provisional choice, revise the decision and implementation together. Keep the rationale, implementation locations and unresolved questions in the project's design note; resume from that record and the current UI. Reopen only affected decisions for a local change.

Use [verification](references/verification.md) for reviews and changes to workflows, visual presentation or interaction behavior. Match verification to the scope and impact. For implementation, repair observed mismatches and recheck affected scenarios. Finish with the requested deliverable, actual evidence and explicit limits. Source inspection cannot establish visual or interaction success.
