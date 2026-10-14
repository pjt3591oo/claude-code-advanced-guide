---
type: DesignJudgment
title: System coherence
description: Recognize which visual and behavioral decisions should repeat and which differences matter.
tags: [design-system, tokens, components, exceptions]
---

# System coherence

A system makes related decisions change together. Equal values alone do not establish a shared role: two 12px gaps may separate words in one place and objects in another. Conversely, selected navigation and selected document objects may share a state concept while needing different presentations.

Look for recurring relationships in real screens and connect their semantic roles to tokens and component behavior. A reusable row owns content hierarchy, action scope and state as well as padding. When assembly decisions also repeat, encode them in a shared composition with meaningful variation and optional content that can disappear cleanly. Similar-looking screens with different decisions may need different compositions; a template should preserve the task. Validate representative and contrasting uses before multiplying a pattern, because consistency repeats defects too. A token palette without those relationships leaves every screen to be redesigned.

Shape follows families and geometry. Related controls share a corner treatment; containers and compact chips may need different ones. Nested outlines should look compatible at their actual inset, not merely reuse an identical radius. A card, confirmation summary and saved-item row can differ in emphasis while preserving object identity, field order and action placement. Unexplained near-duplicate values often indicate local tuning where a shared rule is missing.

Test a rule where it is least convenient: a long title, mixed selection, a keyboard covering the action, an error beside a valid value. If the same correction helps several instances, fix the shared rule. If the difference follows a different task, preserve it as a local variant and state why. Repeated special cases can signal that two roles were merged too early.

For example, a quiet selection surface may work in navigation while a canvas selection needs an outline over arbitrary artwork. Forcing identical styling loses clarity; scattering unrelated values loses coherence. Keep the shared meaning and let the context determine the treatment.

A theme must preserve text-to-surface contrast, layer separation and state differences together. Equal values in one theme can diverge in another. Inspect assets, embedded surfaces and transitions between views too: an unchanged bright backing can overwhelm a dark screen, while an illustration can lose its edges. Adapt presentation without altering meaningful source content. Dark appearance alone does not establish accessible contrast. Introduce a component-specific alias when independent variation has a reason; extra naming layers alone do not create coherence.

Record the reason and the condition that would invalidate it beside the rule. This is how the system retains judgment when its original designer is absent.

A shared value is useful only if its intended consumers stay connected. Copying a resolved value can preserve today's appearance while losing tomorrow's coordinated change. Retain the relationship as well as the number; distinguish roles that may need to diverge. A well-formed token file cannot decide which information should dominate a screen.
