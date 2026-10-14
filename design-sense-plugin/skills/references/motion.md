# Choreograph change

Treat movement as part of the design. Choose its job: acknowledge an action, connect related states, direct attention or reveal a subject over time. Identify a few defining moments in the existing design contract, including start, intermediate and settled states. Give expressive pages a movement language tied to their subject; preserve reading time and access to actions.

Keep the moving object identifiable. Let detail grow from its source, a sheet enter from its owning edge, and returning navigation restore orientation when these relationships fit. Establish a hierarchy among moving elements: the important change leads, supporting elements follow or remain still. Reuse the project's motion tokens. Direct manipulation follows input immediately; settling may ease afterward.

For press feedback, use [action ownership](../knowledge/action-ownership.md): the responding area should match the operation, and acknowledgment should remain distinct from a committed result.

Use [motion rhythm](../knowledge/motion-rhythm.md) when choosing timing or deciding whether repeated movement earns its attention cost.

Choose the mechanism by what drives progress. Local state transitions can use CSS; coordinated, interruptible sequences may need the existing animation library or Web Animations API. View Transitions can connect navigation snapshots where supported. Preserve outgoing visuals long enough for an exit while keeping hidden or departing content out of interaction and focus. Commit application state independently of decorative completion; cancellation or zero duration may prevent completion events.

For scroll storytelling, distinguish continuous scroll progress from a threshold-triggered reveal. Define the scroller, subject, start/end range and reverse behavior; for a triggered reveal, choose once or replay. Use a scroll/view timeline or an appropriate lightweight progress implementation; a visibility observer alone does not provide continuous progress. Keep normal scrolling, anchors and escape from pinned regions. Start from readable content and enhance it only when the mechanism is available, so unsupported animation cannot leave sections invisible.

Handle a new intent while motion is running. Retarget or reverse from the current presentation, dispose of obsolete work, and settle on the latest requested state. For a momentum-based release, use recent direction and velocity in the permitted axis; averaging the whole drag can misread a last-moment reversal. Try rapid open–close–open and navigation return where relevant. Avoid queuing obsolete visual states, stale completion callbacks and artificial delays that hold up a completed action.

Keep frequent animation work small. Prefer transform/opacity when they express the change, inspect expensive layout/paint, and batch layout reads before writes to avoid repeated forced layouts. Those property choices alone do not prove smoothness. Reduced motion should preserve meaning, content and controls with less spatial movement; it must not break completion or leave content hidden, including when the preference changes mid-transition.

When responsiveness is at risk, observe input-to-feedback delay under representative concurrent work. Shortening easing cannot repair an acknowledgment blocked by computation or rendering; reduce competing work while preserving task control. Throttled desktop emulation can expose a bottleneck, but does not establish target-device performance or comfort.

Verify motion in the running interface through temporal evidence, not only endpoint screenshots: observe or sample intermediate presentation, scroll forward/back across the relevant range, interrupt an active transition, and check the settled state and focus. Check the reduced-motion and unsupported paths when tools allow. Record untested device/performance claims explicitly. Recheck visual rhythm as well as functional correctness.
