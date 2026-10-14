# Keyboard and pointer interaction

Use [command scope](../knowledge/command-scope.md) when inputs compete, and [selection model](../knowledge/selection-model.md) when they choose objects. Record consequential bindings in the existing interaction contract: owner, target, availability, effect and recovery. A simple form does not need an editor's command system.

## Keyboard

Preserve native or established component keyboard behavior. Distinguish moving between controls, navigating inside a composite and editing its contents. Arrow keys used to move between cells must become available to the caret or nested control while editing. Keep a clear way back to navigation.

Resolve a shortcut's scope before suppressing defaults; account for editable content, input-method composition, active overlays and already-handled events. Test composition confirmation and cancellation in supported input methods: an Enter used to complete text must not also submit the application action. `isComposing` describes a composition interval, but boundary event ordering needs verification. Synthetic key events do not prove real composition behavior.

Choose `key` for interpreted key meaning and `code` only when physical position is intentional; keep displayed bindings consistent with the supported layout. Decide repeat behavior per command. For character-only shortcuts, provide disabling, remapping to include a non-character modifier, or activation only while the owning component has focus. Excluding text fields alone is insufficient. Check actual browser, system and assistive-command conflicts rather than assuming one modifier translation solves them.

## Pointer

Use logical primary and secondary actions rather than assuming physical left/right mappings. Distinguish selecting, activating and entering edit mode. A double-click follows clicks; its initial clicks must not navigate away or perform a conflicting commit. Keep an ordinary discoverable route to the same operation instead of making rapid clicking essential.

Open contextual actions for the target chosen by the selection policy. Support keyboard invocation and a visible route to needed actions. Retain the native menu outside a surface that genuinely owns a replacement; globally suppressing it removes unrelated browser functions.

For dragging, determine which gesture owns the movement before changing data. Use the established control's activation behavior or a tested threshold, not a universal distance. Preserve text selection and scrolling elsewhere. Track the initiating pointer through release or cancellation; pointer capture keeps receiving events but does not identify a valid drop target. Capture loss alone does not distinguish success from cancellation. Show admissible destinations. If edge scrolling is needed, identify its scroll owner, bound its speed and stop it with the gesture. Prevent a completed or canceled drag from also triggering an unrelated click. The interaction contract owns commit and Undo boundaries.

A wheel event need not scroll, and scrolling need not originate from a wheel. Preserve normal scrolling and browser zoom outside a surface with an explicit alternative contract. For custom pan/zoom, distinguish axes and delta units, retain a meaningful zoom anchor and test both wheel and trackpad input. Read actual scroll position when the design depends on scrolling. Consume events only where the owned behavior needs it; a page-wide wheel handler can trap ordinary navigation.

## Verify conflicting sequences

Exercise the relevant conflict, not every device combination: edit text with objects selected; open and dismiss a menu before repeating a shortcut; extend selection after reordering; begin a drag then cancel or release outside; double-click through the full sequence; scroll from an inner region to its boundary. Verify resulting targets and data as well as focus and feedback. Compare pointer and keyboard routes to the same command. Report real input-method, trackpad or assistive-technology paths as unverified when only simulated events were available.
