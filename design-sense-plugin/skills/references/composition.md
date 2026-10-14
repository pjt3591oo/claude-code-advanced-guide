# Compose from the work outward

Establish what the first viewport should let someone understand or do with actual content. A landing page, a returning user's workspace and an immersive story allocate attention differently. Inspect an appropriate reference in a comparable state when available. Extract proportions, density and relationships; identify inferred choices when direct evidence is unavailable. Record a consequential visual direction in the existing project decisions.

When an important composition choice remains unresolved, compare small rendered alternatives with the same content, state and viewport in the real shell. Vary the relationship in question—information order, region proportions or action placement—rather than just its colors. Keep the option that better serves the intended decision, record the observed reason, and carry its rules into implementation. A settled direction or a local correction does not need an alternatives exercise.

## Give regions ownership

Derive shell → landmarks → regions → groups → detail. Give each region a purpose, content, width behavior, scroll owner and relationship to its neighbors. Visual grouping is not automatically an ARIA landmark.

Separate global, document, selected-object and transient actions by scope. A contextual inspector needs an inspected object. A header band should align with the columns it governs; repeated location labels alone do not justify another global bar. Identify which region owns gutters, safe areas and fixed actions before adding insets.

For difficult spacing decisions, use [grouping and rhythm](../knowledge/grouping-rhythm.md). When allocating accent color across surfaces, text and states, or resolving competing emphasis, use [visual weight](../knowledge/visual-weight.md). Express ownership through the rendered content edges as well as container geometry.

For reflow or overflow, use [responding to constraints](../knowledge/constraint-response.md). Distinguish page width from a component's available space. Inspect intrinsic sizing and wrapping before hiding content; assign spacing to the layout that owns it so wrapping, absent items and reordered content retain the intended relationships. Check visual and keyboard order after rearrangement.

## Make content carry the composition

Use the product's actual language, meaningful labels and realistic variation. Let scan order follow the task and writing direction. Long values, absent data and populated work should survive the same composition as the chosen example.

For crowded glyphs, loose text stacks or unstable row heights, use [text rhythm](../knowledge/text-rhythm.md). Inspect the loaded font, line boxes and spacing within and between text groups at working size.

Persistent copy needs a role. Use [copy necessity](../knowledge/copy-necessity.md) when titles, subtitles or empty states compete with content. Preserve user-authored information while reconsidering its location and prominence. Keep fixture explanations in the handoff; a simulated action needs a clear notice where it is reviewed or performed. Use [commitment boundaries](../knowledge/commitment-boundary.md) if that notice is being turned into an extra step.

For dots, badges and derived counts, use [information confidence](../knowledge/information-confidence.md) to compare the implied meaning with the actual condition and clearing behavior.

Use [disclosure cost](../knowledge/disclosure-cost.md) before moving decision-critical content into tabs, accordions or temporary surfaces. Evaluate what the closed state communicates, not just the expanded layout.

## Inspect three scales

- **Reduced detail:** does the dominant grouping match the intended hierarchy? Demote competing chrome without losing orientation.
- **Scan:** can people locate the object, action and result? Check alignment and the rhythm between peers.
- **Read and operate:** inspect wrapping, hit areas, focus, mixed values and errors at working size.

Measure text contrast against the rendered background: ordinary text should meet 4.5:1, qualifying large text 3:1. Keep metadata readable and status distinguishable beyond hue. See [WCAG definitions and exceptions](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

When the result feels wrong, name the broken relationship before changing styling. Correcting content order or region proportions can resolve what another font, accent or shadow cannot. Preserve expressive choices that serve the subject, and evaluate visual fit alongside usable behavior.
