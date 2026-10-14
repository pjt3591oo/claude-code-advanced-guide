# Charts and quantitative displays

Use [quantitative comparison](../knowledge/quantitative-comparison.md) to resolve the claim before choosing a renderer. In the existing design note, connect the reader's question, measure and comparison scope to the encoding and a case that could mislead. A library's attractive default is not that decision. Reuse the project's chart system when it supports the necessary semantics and operation.

## Choose the comparison

| Needed reading | Useful starting point and tradeoff |
|---|---|
| Exact values or very few facts | A table or text may be clearer than a chart. A sparkline needs an identifiable measure and period, not invented activity. |
| Rank or magnitude | Aligned bars or dots; preserve a meaningful category order when sorting by value would destroy it. Horizontal labels often suit long names. |
| Change over time | Lines for trajectories; columns for separate period totals. Use steps when a value remains in force until changed. Do not sum snapshots as though they were period flows. |
| Composition | Stacks across groups; a pie or donut can show a few clearly different parts of one total. Close segment comparisons need aligned marks. Parts must be mutually exclusive; overlapping responses do not make a valid whole. |
| Spread or association | Histograms, distribution summaries or scatter plots. Expose binning/summary meaning, sample size and relevant outliers; a fitted line is not causal evidence. |
| Dense comparisons or many series | Small multiples or a heatmap when patterns matter. Retain a comparable scale and enough labels to identify intersections; preserve exact lookup elsewhere. |

## Preserve the encoding

Specify aggregation, denominator, time grain and timezone when relevant, missing-data handling, axis domains, units and rounding. Keep chart, tooltip, summary and accessible data on the same transformed dataset and applied filters. A zero denominator is undefined, not a zero rate. Do not quietly turn withheld or unavailable values into ordinary observations.

Use categorical, sequential or diverging color roles deliberately; diverging color needs a meaningful center. Add direct labels or other identifiers where they reduce legend lookup. Check text and graphical contrast against their actual adjacent surfaces in each supported theme. Selection and hover should remain distinguishable from series identity and magnitude. Gridlines support reading; quiet them before weakening the data. Bar rounding, area fills and entry animations must not conceal small or negative values or imply unmeasured change.

For uncertainty, use ranges or bands that the intended reader can interpret, with the interval type and relevant limitations available. Distinguish observed, estimated and projected values at their boundary. Do not describe a confidence interval as the spread of individual outcomes, or infer significance merely from interval overlap.

## Operate and read

Keep the measure, units, scope and important caveat understandable without hover. Provide a concise accessible identification and summary, plus structured values or a fuller explanation when needed; a long description is not a substitute for an operable chart. Keep structured data reachable as structured content rather than flattening a whole table into one accessible description. Support relevant selection, filtering and inspection by keyboard and touch, with discoverable alternatives to dragging. Dense plots need structured traversal or equivalent controls rather than hundreds of sequential Tab stops.

Distinguish inspecting a point from selecting it or filtering linked views. Keep applied scope and recovery visible. If filtering rescales a plot, make the changed domain apparent; a stationary mark must not silently acquire a different value. A pinned or focused readout must retain its series, time, value and unit without covering the comparison. Preserve ordinary page scrolling around touch gestures. Use transitions only when they help follow identity or change; keep the result readable with reduced motion.

On narrow screens, reduce tick density, reflow labels or reorganize panels before shrinking all text. Preserve the comparison the user needs to make; moving related series into separate swipe pages can force memorization. Test both an initial narrow load and resizing of the containing surface.

## Verify the claim

Trace representative rendered marks and readouts back to supplied observations and calculations. Include an unequal denominator, missing value versus zero, negative or tiny value, incomplete period, and changed filter where applicable. Check totals, ordering, category identity, scale changes, clipping and labels after updates. Exercise actual point inspection and clearing by available input methods; inspect the accessible reading order and data alternative. Verify any dynamic takeaway against the current scope. Separate these checks from visual quality and statistical validity; a plausible curve and a passing build establish neither.
