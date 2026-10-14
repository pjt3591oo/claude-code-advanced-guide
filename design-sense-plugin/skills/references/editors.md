# Preserve the editing model

Identify document entities and relationships. Keep selection, tool mode, viewport and history distinct from persistent content. Nested work needs real parent/child ownership.

Use [editing model](../knowledge/editing-model.md) when visible content maps to an owning property or edits propagate through shared relationships.

When the result is discovered through iteration, support changing part of a draft, comparing alternatives and reverting a trial while retaining accepted work. A structured builder can suit a known result. Separate invariants that must always hold from output requirements checked at commitment; neither premature validation nor unrestricted invalid states serve every editing task.

Use [selection model](../knowledge/selection-model.md) for object and range selection, and [keyboard and pointer interaction](keyboard-pointer.md) when commands or gestures compete across the canvas, text editor and inspector.

Derive the inspector from selection type, count, capabilities and mixed values. Canvas, tree and inspector must agree on target and current state; no selection must not expose stale object values.

For a Figma-like slice, preserve creation, multiple selection, move/resize, precise editing, ownership and recovery. Layout editing needs a container whose children actually reflow; flat artboard alignment is a different operation. Retain independent quantities such as padding sides even when initially linked. Make asymmetric and mixed states expressible, and show the active axis and reference.

For frequent dimensions in a pointer-first editor, try label scrubbing with exact entry before repeating fields. A label beside an input does not implement a gesture. Preview on the object, keep cancellation and one Undo transaction, and retain keyboard/non-drag access. Choose another fast path when the task warrants it. Check target and inspector together, including at another zoom level.

Node editors need connection meaning, valid destinations, pending/invalid edges, rerouting and execution state. For node-style layouts, successive additions should be individually reachable without first untangling a pile. Verify initial placement before arranging the test scene by hand. Timeline editors need time scale, playhead, tracks, trim/seek and transport state. Derive those controls from the work rather than copying a visual-design inspector.

Placement is usable only within the working viewport. Opening an inspector, revealing results or adding distant objects can hide the target or shrink it beyond reading. Preserve a readable working target and an intentional route to overview; fitting the whole document is not always the right response. Use [interaction continuity](../knowledge/interaction-continuity.md) when retained execution results outlive the objects that produced them.

Distinguish canceling the active interaction, undoing a completed action and restoring a document snapshot. Specify what each restores and preserves, including whose edits it reverses in collaborative work. Undo should not silently overwrite unrelated later work; document restoration needs its broader consequences made clear. Restore enough context to find the recovered target.

Use a meaningful scene and exercise different object types, no selection, mixed selection, nested ownership and a narrow working viewport through a complete edit and recovery sequence. Include later unrelated work when checking recovery scope. State the prototype boundary without claiming reference-product parity.
