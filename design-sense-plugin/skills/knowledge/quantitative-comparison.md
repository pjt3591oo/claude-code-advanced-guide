---
type: DesignJudgment
title: Quantitative comparison
description: Preserve the meaning of a comparison through aggregation, encoding and changing scope.
tags: [charts, data, scale, uncertainty]
---

# Quantitative comparison

A chart makes a claim through geometry before someone reads its values. Identify the decision and what one observation measures: entity, unit, population, period and aggregation. Counts answer total volume; rates answer frequency relative to exposure. Neither substitutes for the other. Changing a denominator or comparing an incomplete period with a completed one can manufacture a trend. A whole-population rate generally needs the combined numerator and denominator, not an unweighted average of subgroup rates. Keep percentage-point change distinct from relative percentage change.

Choose what needs to be compared directly. Shared positions or lengths support close comparisons; stacked segments emphasize composition but hide differences between segments without a common baseline. Normalizing every group to a full bar removes information about total size. A distribution can expose long waits or multiple clusters that an average conceals. Do not discard unusual observations to make the picture tidy; investigate their meaning.

The scale is part of the claim. Magnitude bars and areas measured from a baseline need that baseline at zero; interval bands and range marks represent their stated bounds instead. A line or scatter plot can use a narrower domain to reveal relevant variation, with the domain legible. Keep scales consistent across panels when comparing magnitude. Independent scales can reveal each series' shape but cannot support the same size comparison. Separate unrelated units rather than tuning two axes to make their paths agree. Label transformations and their reference value.

Connections imply continuity. Preserve elapsed-time spacing when it matters; absent observations are not zero, and connecting across a gap asserts information the measurements may not supply. Smoothing can invent peaks or threshold crossings. An estimate, forecast or interval needs a distinguishable meaning, not merely a lighter stroke. Name what an interval describes and its basis; its width, overlap or a rank alone cannot establish a meaningful or statistically supported difference.

Color can encode identity, order, distance from a meaningful midpoint, or attention. Choose the role first. An ordered lightness scale suits magnitude but can imply a ranking between unrelated categories. Keep category identity stable through sorting, filtering and theme changes, and retain non-color identification. Do not let selection overwrite the data meaning of a heatmap cell. An analytical view should permit discovery; a fixed editorial conclusion must not remain after filters make it false.

Use [chart design and verification](../references/charts.md) when constructing or reviewing the display.
