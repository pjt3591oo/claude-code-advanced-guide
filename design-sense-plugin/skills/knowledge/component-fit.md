---
type: DesignJudgment
title: Component fit
description: Judge whether an available component fulfills the intended operation and where adaptation belongs.
tags: [components, behavior, composition, handoff]
---

# Component fit

A component name is a candidate, not a behavioral agreement. Similar-looking pickers may commit an existing object's identity or accept arbitrary text. Decide what counts as an answer before choosing the control; typed query, focused option and committed value can be different states. A close visual match can still implement the wrong operation.

A supplied design establishes the required anatomy, geometry, state presentation and interaction. Translate those requirements into cooperating parts before choosing tags. A single designed control can require several elements, shared state, positioning and motion; having a similarly named native element does not make it a complete implementation. A visual mismatch is a real capability gap even when the basic action works. Preserve the design through composition, scoped styling or custom behavior rather than simplifying it to fit a convenient primitive. Identify unspecified behavior separately from requirements already visible in the design.

Choose the implementation at the interaction boundary that matters. A native selector fits when its rendered anatomy and actual opening, navigation and commitment behavior fulfill the design and task. A custom option surface may be needed when selection involves richer comparison, preview or nested actions. Finding a native element inside a composite does not establish that it owns the visible interaction; it may serve form submission or an alternate input mode. Retain suitable native support inside the composition where it meets the requirements. Test the opened or editing state and the return to the surrounding task before committing to either approach.

Native semantics do not require browser-default presentation. Allocate visible presentation, editing and form responsibilities separately; native styling, a hybrid wrapper and a custom widget solve different gaps. Keep the support that fits, while assigning layout and paint explicitly where the interface needs control. A drift caused by intrinsic sizing, a missing shared style or the parent reset calls for a different repair from an incompatible interaction model. Platform capabilities can evolve, so a replacement should answer a current requirement in the supported environment, not a remembered limitation. Judge the retained and replaced layers together: custom presentation can still depend on native editing or form behavior.

Separate what the primitive handles from what the product must decide. A dialog can manage focus without deciding whether dismissal discards a draft. An invalid field can announce an error without blocking progression. A theme changes presentation; it does not supply missing behavior. Verify these boundaries in the actual composition, where replacing a trigger, moving a popup or omitting a part can change semantics, focus or event ownership. Two working components can still conflict when combined: clearing a field must not accidentally submit its enclosing form.

Prefer the smallest supported change that preserves the useful contract: a role token for a recurring presentation change, a supported variant or slot for a local difference, and custom behavior when the intended operation is absent. Editable source makes change possible, not consequence-free; replacing a primitive also transfers responsibility for its interaction guarantees. Conversely, a convenient catalog should not force the product into the wrong workflow.

When handing off a choice, make the unresolved difference concrete: “The field must commit an existing recipient; searching is not selecting. Dismissal restores the previous recipient.” Identify what the chosen implementation already guarantees and what remains product work. Share a state that could disprove the fit, not just the default screenshot. A close visual approximation may be sufficient for a visual exploration; it cannot establish behavioral equivalence.
