---
type: DesignJudgment
title: Editing model
description: Connect the visible editing target to its stored owner and make the reach of a change inspectable.
tags: [editing, ownership, properties, propagation]
---

# Editing model

The thing a person wants to change may be smaller than the object that stores it. A title inside a reusable block can be a direct editing target whose commit updates an exposed property. Preserve that ownership instead of detaching the block just to make its text editable. Show which inner target is active and how to return to the containing object. When direct editing is unsupported or the value is bound elsewhere, explain the constraint and provide a route to the actual owner where access permits.

Connect the visible target, its property control and the resulting value. Two entry points that appear equivalent should preserve relevant formatting, bindings and structure; expose consequential differences instead of silently flattening richer content.

Distinguish changing this occurrence, changing a shared definition and changing a bound source. A linked name alone may not reveal the reach of an edit. Let the person inspect affected uses in their working context, including a contrasting variant or local override. Preserve valid overrides and make the limits of a preview clear. Ordinary reversible shared edits need not acquire a confirmation step; review belongs where the consequences warrant it.

Probe one inner-content edit and one shared change. Inspect the stored owner, an affected use and an unaffected or overridden use, then return to the original editing context. Correct pixels on the selected object do not establish correct propagation.
