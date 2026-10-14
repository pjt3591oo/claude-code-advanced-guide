---
type: DesignJudgment
title: Command scope
description: Resolve an input against the active task before choosing its command, target and recovery.
tags: [commands, shortcuts, focus, input, scope]
---

# Command scope

A key or gesture has meaning within a task. Resolve the active editing surface, focused control, selection and temporary interaction before routing the command. A selected document object can remain visible while a field owns text editing; selection alone does not authorize that object's deletion. An open modal owns its interaction boundary even when background selections remain visible.

One input should reach its intended owner. Escape may cancel an active drag, dismiss a menu or leave an edit; consuming it there should not also close the surrounding workflow. Preserve input-method composition before interpreting its confirmation or cancellation as an application command. Decide which commands remain available during a temporary state instead of letting every global listener run.

Route equivalent menu, toolbar and shortcut actions through the same target, applicability and history rules. A disabled command must not become available through its shortcut. Resolve the relevant undo history: editing text and moving an object need not share it. Hold-to-repeat may suit nudging, while a one-time submission should not multiply as a key remains down.

Shortcuts repay repeated effort only when they remain learnable. Keep ordinary controls and keyboard navigation available; reveal a useful shortcut beside its command. Match the delivery environment's conventions and resolve conflicts with browser, system and assistive commands. A simple occasional form may gain nothing from a shortcut scheme.

Probe the same command while focus is on the work surface, in an editor and inside a temporary surface. The target, availability and recovery should follow that context. Treat keyboard layout and text composition as operating conditions, not merely alternate labels on identical keys.
