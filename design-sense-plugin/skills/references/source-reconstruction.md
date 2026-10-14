# Reconstruct an existing interface

Use this process when the requested outcome is faithful reproduction, a source-derived design system, or a framework port that preserves the original interface. The source's observable appearance and behavior are the baseline. Treat inspiration and redesign differently: apply creative judgment only to decisions the user leaves open. An authorized icon replacement does not authorize changing typography, density, component anatomy or interaction.

## Establish the source and coverage

Identify the source surface, captured build or asset hashes, theme, viewport, browser zoom and device scale. Record relevant fonts, content and selection state so comparisons can be repeated. Reuse available captures; resolve disagreements against the matching live state rather than mixing different builds or themes.

Build an inventory from actual source instances and implementation relationships. Separate components, variants, compound patterns and tokens. A token prefix or a generated export name is a candidate, not proof of an original component. For “all components,” record the inspected routes, panels, overlays and loaded or reachable modules; follow discovered component paths until that boundary is accounted for. Keep inaccessible or unidentified entries visible. A finite download list does not prove that every lazy-loaded surface was captured.

Maintain one compact coverage record in the project's existing documentation. For each source component, connect its identity and observed location, variants/states, CSS and JS evidence, target implementation path, comparison result and any authorized deviation or unresolved evidence. Label evidence as observed, code-traced or inferred. Keep collection, implementation and verification status separate; continue through the requested inventory without turning a representative sample into an exhaustive claim.

## Trace the rendered contract

Inspect the live DOM and computed styles alongside source rules. Trace winning declarations, inherited styles, theme scopes, pseudo-elements and state selectors. Capture anatomy and slot order, dimensions, padding/gaps, font metrics, alignment, fills, borders, shadows, overflow and hit areas. Preserve semantic token roles even when their current values coincide. Variable extraction alone misses the rules that consume them.

Follow relevant JS from the rendered instance to its render branches, props, state, handlers and dependencies. Resolve hashed classes or minified symbols through their actual use. An import graph is navigation evidence; it does not establish selection, commitment, focus, dismissal or keyboard behavior. Exercise the source controls to check that interpretation, including applicable combined states and transitions. Mark missing code or ambiguous behavior as unresolved rather than filling it with a familiar library's defaults.

For fields, pickers and overlays, read [component behavior](component-behavior.md) before selecting the target primitive. Establish the visible instance's contract with a complete use sequence and an applicable cancellation or dismissal sequence; include the opened or editing state, affected value and focus destination. Trace shared event adapters and contextual overrides as part of that instance. A native element found in one render branch may be a fallback or a hidden form bridge; identify which path actually handles this interaction. Code-traced but unobserved behavior remains provisional.

Trace motion in both CSS and JS: trigger, animated properties, duration/delay, easing or spring parameters, origin, mount/unmount timing and interruption behavior. Observe intermediate states and exit transitions as well as the final frame. Include reduced-motion behavior when available. A list of animation constants does not establish which component uses which motion.

## Port and compare before expanding

Take a representative component through source tracing, target implementation and a matched rendered comparison, including its use and cancellation sequences, before repeating the implementation approach. Resolve structural and behavioral mismatches there. Then apply the process to the remaining inventory and integrated compositions. One field does not validate a picker or overlay strategy; exercise the different behavioral families before extending each approach.

Recreate the required anatomy, layout constraints, style ownership and state transitions in the target framework. Preserve wrappers and pseudo-elements that affect layout or paint; incidental source structure may change when equivalence is verified. A native control or third-party primitive is usable only if its rendered appearance and interaction contract can match the source. Do not let its defaults silently replace the contract. Share code where source relationships support it, rather than collapsing distinct controls into a generic catalog.

For an approved asset substitution, preserve the source slot's size, alignment, visual weight and state colors as closely as the replacement permits; record the deviation. Treat unavailable fonts or assets as specific limits. Keep documentation-gallery styling separate from the reconstructed component so demo wrappers and global resets cannot change its appearance unnoticed.

When transforming extracted CSS, use syntax-aware parsing for selectors, declarations and at-rules. Class identifiers need not contain digits; selector-list commas may be nested, and data URLs may contain declaration delimiters. Preserve conditional rules, specificity and complete keyframe groups. Remove an approved asset declaration without damaging neighboring declarations. Inspect portal ancestry and local theme overrides as well as root tokens. After a parse or hot-reload failure, confirm the page loaded the current build and inspect a changed computed property before using its screenshot as evidence; a server may keep the last valid stylesheet.

Compare source and target with matching theme, viewport/scale, content, container constraints and state. Inspect paired screenshots or overlays for geometry, typography and paint, then use computed-style differences to locate causes. Avoid arbitrary tolerances chosen after seeing a mismatch. Small rasterization differences can be explained; changed anatomy, density or state treatment must be repaired or identified as an authorized deviation.

Exercise the same pointer and keyboard sequences in both implementations: applicable hover/press/focus, selected/disabled/loading, open/close, commit/cancel and interrupted motion. Observe focus and affected values as well as appearance. Recheck integrated uses after shared-style changes. Tests should expose a plausible source-contract regression; a component mounting successfully proves only that it mounts.

## Report fidelity honestly

Report implemented and compared components/states against the known inventory, with links to the source evidence and target files. Keep missing surfaces, inferred behavior and unverified states explicit. “All restored” requires the declared scope to be accounted for and its required comparisons to pass. File, module, component and test counts measure different activities; none substitutes for that evidence.

If live access or a required observation is unavailable, finish independently supported work and describe the precise verification gap. Do not relabel an approximation as a verified reconstruction. Fix observed mismatches within the authorized scope and renew the affected evidence before completion.
