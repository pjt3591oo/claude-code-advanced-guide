---
type: DesignJudgment
title: Date selection
description: Match date navigation to how a date is chosen and keep the selected value in context.
tags: [dates, availability, selection, continuity]
---

# Date selection

A known date and a search for an available day are different tasks. Direct entry suits a known value; a familiar month grid exposes weekday and month relationships; a short date strip makes nearby alternatives cheap to compare. A short booking horizon alone does not justify replacing familiar calendar structure. A compressed view earns its space saving when proximity or availability leads the decision and dates remain easy to locate, including across a month boundary. If uncertain, compare it with a month view using the same dates and viewport. A compact view needs a clear route to every supported date. A native picker can be appropriate, but does not by itself explain product availability.

After a jump, reopen or return, the selected date should remain visible in its relevant week or month. Appending a distant day to an unchanged initial week preserves the value but breaks temporal adjacency. Keep month/year context unambiguous across boundaries, and keep the summary and available times tied to the same date.

The booking horizon, displayed month and selected value answer different questions. Give each a clear owner; repeat context when distance or a new state needs it, rather than stacking neighboring captions for the same fact.

Today, selection, focus and availability are independent facts. An unselected option can be available; availability that depends on a missing prerequisite remains unresolved. Neither means fully booked. Derive an unavailability reason from actual data or policy, not from a disabled control. Keep unavailable options distinguishable and correctly exposed to assistive technology, but add visible reasons where they help choose an alternative; repeating the same status inside every cell can obscure the dates or times. Availability may depend on duration or another resource. When that prerequisite changes, preserve valid choices and identify any invalidated time instead of presenting a stale selection as bookable.

A sheet or inline calendar is a surface choice, not a substitute for this model. Define whether choosing a day commits immediately or creates a draft; dismissal must respect that boundary. Probe a date outside the initial strip, a month change, no availability and reopening the current value. A compact one-day task need not pay for a full calendar.
