# Interaction contracts

Choose a control from the user's action, semantics, frequency, precision, space, and input method. A data type supplies constraints; it does not choose the interaction. Native inputs and selects remain useful, including as the accessible or precise entry path inside a richer control.

Before implementing or replacing fields, pickers or overlays, use [component behavior](component-behavior.md) to resolve their value, focus and event lifecycle. For a reconstruction, take these decisions from the actual source instance; for a new interface, define them from the intended task. Then judge primitive compatibility through [component fit](../knowledge/component-fit.md).

Use [input demand](../knowledge/input-demand.md) when deciding what information to request, its precision or the order of dependent questions. Include preparation and correction effort, not only visible steps.

When the operation chooses a date or available period, use [date selection](../knowledge/date-selection.md); the supported range and selection context are part of the control's contract.

For each important operation specify: target/scope, preconditions, gesture or command, preview feedback, commit boundary, cancellation, Undo/recovery, and keyboard or non-drag alternative. Bind an edit to its starting targets and before-state; later selection or focus changes must not retarget a pending commit. One deliberate edit usually deserves one history entry, not hundreds of pointer moves.

Define draft lifetime across navigation, closing and reload. Leaving a surface is not automatically Save or Discard: retain unfinished work by its owner, or make intentional loss clear and recoverable where appropriate.

Use [feedback scope](../knowledge/feedback-scope.md) to choose waiting, error and recovery surfaces. Distinguish user-correctable input from service or permission failures, and preserve the affected work. Make dynamic status perceivable without unnecessary focus changes; the disappearance of a spinner alone may not communicate completion.

Use [action ownership](../knowledge/action-ownership.md) for rows with child actions, press feedback and controls with ambiguous commit timing. Prefer native semantics; a styled wrapper must preserve the underlying label, focus target and activation behavior.

For shortcuts, context menus, selection gestures or custom wheel/drag handling, use [keyboard and pointer interaction](keyboard-pointer.md). It connects command scope and selection decisions to actual input sequences.

Use these as candidates, not mandatory mappings:

| Meaning / task | Candidate interaction | Guardrail |
| --- | --- | --- |
| Frequent spatial size/position | Canvas handle or label scrub plus precise field | Units, axis, bounds, modifiers, cancel, Undo |
| Alignment/distribution | Spatially recognizable buttons/matrix | Name the reference: parent, selection bounds, page |
| Layout direction/gap/padding | Direction preview and coupled dimension controls | Show parent/child ownership; linked/unlinked values |
| Color/opacity | Color well/picker, slider or scrub plus exact value | Preview must affect target; clear accept/cancel semantics |
| Discrete choices | Segmented control, radios, select or search | Comparison demand, familiarity, available space and immediate versus deferred commitment |
| Hierarchy/reference | Tree/search picker | Identity, parentage, keyboard navigation, empty states |
| Connections/time/curve | Ports, timeline or curve manipulation | Valid destinations, scale, precision, recovery |

Expose the current state rather than a guessed default. Multiple targets can be equal, mixed, partially applicable, or invalid. Distinguish no selection from an empty document. A field's label, tooltip, icon and actual effect should agree.

Reuse existing primitives when they meet the contract. If extending one, keep state logic separate from its presentation; do not introduce a component library merely to satisfy a naming convention. Build and exercise the difficult path before multiplying similar controls.

For nonessential application drag operations, provide both a click/tap alternative and keyboard access; keyboard support alone does not establish a non-drag pointer path. Keep focus visible and restore it after popovers/dialogs. Include empty, error, disabled and loading states where the system can reach them; never fake a backend action with an unqualified success toast.
