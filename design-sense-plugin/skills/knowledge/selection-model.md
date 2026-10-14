---
type: DesignJudgment
title: Selection model
description: Distinguish navigation position, chosen objects and the scope of an operation as a collection changes.
tags: [selection, focus, collections, editing, scope]
---

# Selection model

Focus locates keyboard interaction; selection identifies chosen objects; activation performs an operation. Choose when they travel together. Browsing a multiple-selection list should not silently replace its selected set. Opening every item as focus moves can make navigation expensive; an immediate local preview may justify following focus.

For a collection that supports selection, define replacement, addition, removal and range extension. A range needs an anchor and a current endpoint in an understood ordering. Retain identity across sorting or virtualization rather than selecting whatever later occupies an old position. When filtering changes visibility, decide whether hidden selections remain and make their effect on bulk work intelligible. Define whether select-all covers visible items, loaded items or matching results before promising it.

A context menu needs an explicit target. Opening it on a selected member may preserve the set; opening it elsewhere, including empty space, needs a deliberate target policy. Neither universally preserving nor universally replacing selection is sufficient. Make the affected object or set recognizable before a consequential command; dismissing a menu is not executing it. Keyboard invocation must obtain its target from the current interaction context rather than a stale pointer position.

Keep a selectable object distinct from selectable text within it. A drag handle or a separate editing state may resolve competing intentions better than disabling text selection across the page. Use the product's established modifier conventions and offer an understandable route without remembering them.

Try selection, sorting or filtering, opening a menu, canceling, and applying a bulk operation. The visible scope and the objects actually affected should agree throughout.
