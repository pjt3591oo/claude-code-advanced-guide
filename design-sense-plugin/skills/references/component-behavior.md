# Fields, pickers and overlay behavior

Read before implementing or replacing these controls. Use the relevant probes below to establish a behavioral contract, not to add every listed feature. In a reconstruction, observe the actual source instance and trace its handlers; in a new design, decide the contract from the task. Familiar names and library defaults are candidates, not answers.

Before selecting native, hybrid or custom construction, read the applicable rows in [control capabilities](control-capabilities.md). Use them to uncover missing requirements and assign visible, editing and form responsibilities; return here for full interaction sequences. This applies to new implementations as well as reconstruction.

## Establish the contract before choosing a primitive

Keep a compact record beside the component's existing implementation or evidence notes:

- Derive the visible parts and states from the supplied design, then identify the operation and affected value owner. Map required anatomy and behavior to cooperating elements and adapters rather than matching the component name to one tag. Separate displayed text, draft, query, active option, selected value and committed data where they differ.
- Record reachable state transitions as `starting state → input sequence → value/effect → focus destination`. Include a complete use sequence and an applicable cancel/dismiss sequence, followed by reopening or returning to the field.
- Identify the commitment boundary, validation, disabled/read-only behavior and any close veto. State which behavior belongs to the primitive, a shared input adapter, the parent form or the surrounding application.
- Record the primitive choice, the consequential capability it must satisfy, the native responsibilities retained, and any gap requiring an adapter. Identify a scenario that would disprove the choice; a component name, available package or native tag is insufficient evidence.
- In a port, connect each consequential choice to a runtime observation or traced source path. Trace imported handlers and provider configuration; copying a leaf render function can omit the entire input model.

Compare a proposed native, headless or custom primitive against this contract before spreading it across the catalog. Reuse compatible plumbing and implement specific gaps. When a behavior is unresolved, finish supported work while keeping that decision provisional; an approximation is not a verified component. A local demo should expose the real value/effect boundary with state or callbacks so the contract can be exercised.

## Native semantics, browser defaults and layout

Treat semantic role, input behavior, browser-painted appearance and layout as separate decisions. Native semantics can be retained while a scoped style or wrapper reproduces the intended surface. Where a platform popup cannot express the required opened UI, choose a compatible custom primitive and verify its keyboard/focus contract. Replacing every native element with a generic container merely exchanges one set of responsibilities for another.

When layout drifts, inspect the winning style and box for the actual element and parent. Distinguish browser defaults from missing source rules, inherited gallery resets and changed wrapper structure. Check relevant appearance, margin/padding/border, font/line-height, box sizing, intrinsic minimum width, flex/grid shrinking, baseline alignment and overflow. Fieldsets and legends, inputs, textareas, buttons and disclosure markers can contribute special sizing or paint even when their surrounding wrapper looks correct. Resolve the observed cause locally; a blanket reset can remove focus affordances or native editing behavior.

Trace styling dependencies as well as event dependencies. A leaf component's module may not contain its shared layout classes. Check that the rendered parts' required rules were actually included, then inspect the computed layout. Valid class strings and a successful CSS build do not establish that those rules exist or win. Test the component at its actual narrow container size and with long or mixed values, including the editing/open state; verify that the component does not depend on undocumented gallery resets.

Make native defaults explicit where they change the operation. Give non-submit buttons their intended type and test them inside a form; inspect disclosure, label activation and focus behavior in the real parent composition. Native accessibility support is useful evidence about semantics, not proof of visual or behavioral parity.

## Select, combobox and command menu

A selector commits a choice; an editable combobox also owns a query; a command menu invokes actions. Similar popup geometry does not make these interchangeable. Active keyboard focus, hover preview and committed selection may be separate. A trigger with a chevron does not determine which model applies.

Inspect the opened surface, not only its closed trigger. Establish how it opens by pointer and keyboard, where focus starts, how options are navigated, and what selects, closes or cancels. Probe Enter, Escape, Tab and outside interaction in context; record results rather than imposing one universal close rule. Where present, check grouping, disabled items, selected-item scrolling, typeahead versus filtering, empty results, multi-selection and whether choosing the current value has an effect.

Identify the actual visible and event-handling path before relying on a native `select`: a found element may be a hidden form bridge, fallback or separate variant. If the source uses a native popup, retain its platform behavior when it fulfills the contract. If the visible source uses a custom list, a styled native trigger alone does not reproduce it. Verify popup placement, width, clipping and dismissal as part of the comparison.

Try changing an option, canceling a later tentative choice and reopening. Compare the committed value, active option and trigger summary. Preserve an empty or mixed value when the contract supports it; silently selecting the first option invents an answer. In controlled use, check that a parent value update reaches both the summary and opened selection.

## Text input and textarea

Treat text editing as a draft lifecycle. Establish whether changes propagate on each edit, Enter, blur or an explicit action, and what Escape preserves or restores. A single-line input, multiline editor and message composer can assign different meanings to Enter. Inspect configured modifiers and composition handling before mapping Enter or Shift+Enter to submission or a newline. Completing an IME composition must not accidentally run a command.

Probe typing and paste, a newline, commitment, cancellation and leaving/re-entering the field. Inspect the stored value as well as the displayed text. Where relevant, preserve selection/caret, select-on-focus, read-only selection and controlled updates. Follow shared event adapters and per-instance options rather than replacing them with a plain `onChange` callback.

For auto-growing textareas, inspect minimum/maximum height or rows, growth and shrinkage, wrapping after container-width changes, and scrolling at the cap. Test both typed and externally supplied multiline text, then shorten it. Verify that the caret and last line remain visible. A fixed `rows` value or CSS resize handle does not reproduce automatic sizing. Preserve a fixed-size textarea when that is the intended contract.

## Popover, dialog and tooltip

Separate the surface's lifecycle from the action inside it. Closing an editor is not inherently saving or discarding it. A popover may contain a form, a menu or supplementary information; its name does not specify modal behavior, a focus trap or a dismissal policy. Tooltips may use a different hover/focus lifetime and recent-reentry delay from interactive popovers.

Trace `trigger → mount/position → initial focus → interaction → close request → exit → unmount/return`. Establish anchor, alignment, offset, collision/fallback placement and updates when the anchor, content or viewport moves. Compare local theme inheritance and portal ownership, since moving a surface can change both styling and which interactions count as outside.

Probe trigger toggling, inside interaction, outside pointer down/click, Escape and focus traversal. Determine whether each is allowed to close, whether a close can be vetoed, what happens to a draft, and where focus returns. Use the observed source behavior for reconstruction; use the intended modality and task for new work.

Exercise a child popup within a parent overlay when supported. An interaction inside the child's portal must be classified according to its logical ownership; verify whether Escape closes the child, the whole stack or neither. Inspect focus restoration when a trigger disappears. Do not assume a library's default modal flag or outside-click behavior matches the required composition.

Observe exit and interrupted open–close–open through [motion](motion.md). Keep event ownership, interaction availability, unmount and focus restoration consistent through the transition. A stale completion callback must not close a newly reopened surface. Source timings belong to their specific triggers and variants, not every overlay.

## Event ordering and related controls

Cancellation is an invariant across the whole event sequence. For a field that commits on blur, try `edit → Escape → blur → re-enter`: canceled data must stay canceled. Try `edit → Enter → blur`: one deliberate commit must not produce duplicate side effects or history entries. Use the actual value owner and callback trace; a reset field can conceal a stale blur commit. Also check pointer-down/blur/click ordering when clicking a popup option or a form action.

For numeric fields and sliders, distinguish draft text, valid parsed value, live preview and final commit. Probe applicable units/expressions, bounds/steps/modifiers, pointer cancellation, release outside the track and synchronization between the field and slider. Continuous preview may update many times while one drag creates one final history entry; preserve the intended boundary.

For toggles, checkboxes, segmented controls and tabs, establish selection versus activation, mixed state, disabled behavior and keyboard focus policy. A visually tab-like button group need not share another widget's arrow-key model. Apply the common contract to additional families by tracing their real operation; an expanding list of component names is not behavioral coverage.
