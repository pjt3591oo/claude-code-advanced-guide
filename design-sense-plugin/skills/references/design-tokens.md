# Deliver design intent through tokens

Use tokens to carry decisions across screens and tools. Start with roles needed by the representative workflow, with provisional values that can be tested in its first render. Expand when a new role earns independent control.

## Choose one authority

Inspect the project's existing token source and its consumers. Keep authored values in one place; derive other representations or link to the source. In a small web app, CSS custom properties and shared text styles can be sufficient. A structured `DESIGN.md` can own values when the project consumes or exports them. Use a separate token interchange file when actual tools or platforms need one. Avoid manually maintaining the same values in Markdown, JSON and CSS.

The design note supplies what values cannot: intended character, density, emphasis, permitted uses, exceptions and rationale. Name the source file, role-to-style/component mapping and any generation command. Keep workflow and interaction decisions beside this record or linked from it. A token exporter does not implement those decisions.

## Make the contract concrete

For each recurring role, establish its value or alias, intended use and implementation destination. Cover the workflow's surfaces, text, actions, selection, focus and status; complete text styles; spacing and shape families; and motion where relevant. These are coverage questions, not a required catalog.

Separate raw values from semantic roles when changes should propagate by meaning. For example, action and success can share a current color yet need separate roles. Use a component alias when it requires independent variation. Store references rather than copied resolved values when that relationship must survive edits.

Typography includes family/fallback, size, weight, line height and tracking; retain numeral/features or variation settings when the product depends on them. Dimensions and timing carry explicit units. Define supported themes or density contexts by their role overrides and resolution order, rather than multiplying unrelated palettes.

## Interchange only when needed

Check the receiving tool's supported format before selecting a serializer. Structured Markdown front matter and a token interchange document are different formats, even when both use brace references. For DTCG interchange, verify the required types, references, units and composite fields against the target specification and consumer.

A minimal dimension and semantic alias illustrate the relationship; the value is not a product default:

```json
{
  "space": {
    "unit": { "$type": "dimension", "$value": { "value": 4, "unit": "px" } }
  },
  "control": {
    "iconGap": {
      "$type": "dimension",
      "$value": "{space.unit}",
      "$description": "Separation between a control icon and its label."
    }
  }
}
```

Preserve color space and alpha, dimensional meaning, complete typography and aliases across conversion. For example, a 24px line height on 16px text is a 1.5 multiplier, not 24. Relative units need their actual reference context; changing the unit label changes the design. Record unsupported properties or lossy conversions instead of silently dropping them. Themes and other contexts need supported resolution semantics; a group named `dark` alone does not activate a theme.

## Verify consumption

Validate the source and exported format separately; successful export is not proof of either validity or fidelity. Trace a consequential role from its definition through generated output to the rendered component. For a new token pipeline, change that source value and verify its intended consumers update while unrelated roles remain stable, then restore or retain the value deliberately. Check supported contexts and missing/cyclic references where applicable.

Inspect actual text wrapping, combined states and foreground/background pairs. Passing token checks establishes consistency of representation, not appropriate hierarchy, composition or visual quality.
