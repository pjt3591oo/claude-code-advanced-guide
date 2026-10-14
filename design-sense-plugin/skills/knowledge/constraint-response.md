---
type: DesignJudgment
title: Responding to constraints
description: Identify what limits a composition before shrinking, hiding or rearranging its content.
tags: [layout, reflow, content, constraints]
---

# Responding to constraints

A cramped composition does not automatically need a smaller type scale or another breakpoint. Identify what became scarce: the page's width, a component's allotted space, readable line length, available height or room for an action. A long unbroken value or a child that refuses to shrink can cause overflow even when the intended layout has enough room. Fix that constraint before sacrificing information.

Let the condition follow the failure's owner. Global navigation may respond to the viewport; a repeated item used in both a main column and a narrow panel should respond to its own available space. A wide window can contain a compact component. Choose the transition where real content stops working, then reuse a shared threshold when it fits. Screen width alone does not establish hover, touch or keyboard capability.

Input capabilities can coexist and change during the task. Adding a pointer does not remove touch; pointing capability does not establish keyboard availability. Enhance an available input without hiding the essential action from another. Switching input should preserve selection and unfinished work.

Decide what may yield. Supporting imagery may shrink, text may wrap, actions may move, and secondary detail may be disclosed. Preserve identity, decisive differences and reachable actions through that change. Truncation is a content decision: if two distinct options become indistinguishable, equal row heights have cost useful meaning. Conversely, preserving spatial comparison can justify local scrolling instead of stacking everything.

Probe just before and after a transition with a long value, an absent optional field and enlarged text. Check both the component's bounds and its parent. A successful adaptation preserves the reading and operating sequence; a visually reordered layout can still leave keyboard traversal following the old sequence. Judge the usable result, not how many screen sizes have named styles.
