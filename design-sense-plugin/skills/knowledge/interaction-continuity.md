---
type: DesignJudgment
title: Interaction continuity
description: Preserve the next intended action through focus changes, navigation and delayed input.
tags: [focus, navigation, intent, motion]
---

# Interaction continuity

An interaction ends when the person can continue their intent. Track focus, draft, selection and position as places where that intent lives.

After an interruption, restore enough context to recognize the object, distinguish completed from pending work and take the next action. A saved field value alone may not achieve this. Use the existing task surface; an extra recap is useful only when the restored state cannot explain itself.

Canceling a menu usually returns focus to its trigger. Choosing Reply instead starts composition, so connect the reply target to the composer. The same closing animation does not imply the same focus destination. On touch devices, focusing may also open a keyboard and change the available viewport; observe that path on a supported device when possible.

Navigation does not cancel every prior intent. A pause requested just before opening a profile may still belong to the media. A stale response from a dismissed search should not overwrite the new screen. Decide who owns pending work and what actually cancels it.

After a prerequisite detour, resume the intended object and task; completing the prerequisite does not authorize silently repeating a consequential commit. Canceling should restore the originating work. Where an object belongs and how the person arrived are different paths. Ancestors orient; history resumes. Keep current destination, expanded branch and visited state distinct. A shortcut past repeated navigation must move the continuation point, not only the viewport.

When results or history are retained, keep their originating object and input state intelligible. Renaming or removing the live object must not silently reinterpret an earlier result. Opening that result for reference and restoring it as a new editable draft are different actions; show which one is happening. Retention itself follows the product's policy.

Use motion to make the relationship between states visible. A return transition can preserve place; applying the same directional slide to unrelated destinations can invent a hierarchy. Try typing, Back and rapid input immediately after the action. If the person must relocate the task or repeat input, repair continuity before tuning easing.
