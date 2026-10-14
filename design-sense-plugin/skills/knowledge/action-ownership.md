---
type: DesignJudgment
title: Action ownership
description: Align hit areas, input feedback and state meaning with the operation that actually runs.
tags: [affordance, input, state, motion]
---

# Action ownership

The responding area tells the person what they activated. A setting row and its switch may represent one operation. A record with open, save and author actions contains different operations; making the whole record react to each one obscures ownership. Give independent actions distinct hit and focus targets without also activating their parent.

Acknowledgment and outcome tell different truths. Pressed means input arrived; selected means a choice holds; pending means work remains. Preserve an existing selection while acknowledging a press. A completed press animation cannot establish a successful request. An immediate switch and an option awaiting submission may store the same Boolean value while promising different commit timing.

Treat visible size, touch area and feedback extent separately. A small icon can have a generous target without dominating its row. Scale feedback is optional; if used, check actual movement across different sizes, preserve surrounding alignment and avoid multiplying nested transforms. Keep the response recognizable when spatial motion is reduced.

Meet applicable target-size and spacing requirements in the platform's own units; a minimum does not establish comfort. Repetition, unstable handling and costly near misses may warrant more room. Expanded hit areas must retain unambiguous ownership without overlapping neighboring operations. Inspect actionable bounds separately from icon size.

For ordinary buttons, press feedback can begin before activation. Moving away or yielding to a scroll should release that feedback without committing the action. A canceled pointer sequence is not a completed click; preserve the control's keyboard behavior as well.

Try each target, cancellation and a failed request. Only the intended operation should run, and the visible state should agree with what has actually taken effect.
