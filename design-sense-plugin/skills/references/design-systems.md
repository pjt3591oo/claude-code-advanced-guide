# Establish and evolve the design system

When extracting or reconstructing an existing system, follow [source reconstruction](source-reconstruction.md) first. Its observed component identities, states and relationships define the inventory; the new-system guidance below applies only where design decisions are open.

Use [system coherence](../knowledge/system-coherence.md) to decide what should repeat; use [art direction](../knowledge/design-language.md) when the product's visual character is unresolved. Use [component fit](../knowledge/component-fit.md) when choosing or adapting a library component.

## Work from the project

Inspect the existing tokens, components, usage and design decisions. Preserve intentional conventions. Confirm installed library versions and target platforms before relying on an API; another platform's example does not establish runtime support. Read the relevant official guidance or local implementation, reusing fetched material within the task.

For a design request without a usable system, build the design system before implementing the product screens. An existing palette or component package alone is insufficient: look for reusable tokens and components with appearance and behavior that fit the requested interface. Extend a compatible existing system where only specific capabilities are missing.

Use the requested workflows and supplied design to identify the required inventory. Implement its typography, color roles, spacing, sizing, radii, elevation and motion in shared tokens, and its needed controls and compositions as reusable components. Include applicable variants, interaction states and responsive behavior. Provide a runnable system preview where these can be inspected together. Use React components and StyleX for shared tokens, themes and component styles under the entrypoint's stack policy; verify the actual build integration before expanding the library.

Before assembling product screens, render the preview with realistic content and contrasting states, exercise the consequential component contracts through [component behavior](component-behavior.md), and repair observed gaps. The system is ready for screen work when the required roles and components are implemented, rendered and usable, rather than only documented. Then continue directly into the requested interface using those components. Add or refine shared rules as real screen composition reveals new requirements; keep the initial inventory bounded by the requested work.

Before repeating components across screens, establish their roles in the actual styles and compositions. Compare the list, detail, input and result states that exist in the workflow together:

| Relationship | Resolve in the implementation |
| --- | --- |
| Emphasis | Content, action, selection and status roles; use [visual weight](../knowledge/visual-weight.md) when one accent spreads across unrelated roles. |
| Type and density | Complete text styles and their wrapping/height behavior; use [text rhythm](../knowledge/text-rhythm.md). |
| Shape and spacing | Container, control and compact-item families, including nested edges; use [system coherence](../knowledge/system-coherence.md). |
| Composition | Shared content order, optional slots, action placement and state treatment for recurring objects. |
| Change over time | What stays available while scrolling, what moves on transition, what responds to a press, and what remains still. |

Record a small, explicit token contract for those roles before spreading them across screens. When authoring tokens, a structured design document or an interchange file, use [token delivery](design-tokens.md) to choose its authoritative home and connect it to code. A repeated role should reuse its rule; an exception needs a task or geometric reason. Matching hexadecimal colors and border radii alone does not complete this pass.

## Make the rules executable

Consume the recorded roles in the actual styles and components. Give a component a content hierarchy, behavior and state contract as well as appearance.

For repeated screen families, encode stable relationships in shared compositions with explicit slots and supported variants. Check absent optional content, long content and a different action scope. A slot name documents intent; arbitrary children, style overrides or editable internals can still bypass it. Where a hard acceptance constraint is required, connect it to the accepted output path through the component API or executable validation. Distinguish an automatic check trigger from a rejecting check, and deterministic constraints from model review.

Choose components by the operation, then inspect required and optional parts, state ownership and built-in layout. Distinguish upstream behavior, editable local composition and product policy; a design kit or styles-only package does not establish runtime parity. Fill optional slots only when their information matters. Let one owner provide each gutter, safe area, scroll region and fixed action inset. Extend a useful primitive rather than building wrappers around a misunderstood contract.

For a consequential adaptation, agree on the operation and any committed value, the behavior already supplied, the missing product behavior and one acceptance scenario that could expose the mismatch. Distinguish required outcomes from negotiable presentation. Keep this contract beside the existing design decision or component usage; do not create a separate handoff document for every standard control. After composition changes, inspect the rendered semantics and exercise activation, focus, dismissal and value commitment as applicable. For an extension, also check an existing consumer before resuming ordinary assembly; keep a task-specific exception local.

Exercise combined states. Selected, pressed, focused, loading and disabled can convey different facts at once. Check long content, text enlargement and the supported themes and input methods. Change a shared role and inspect affected instances; a correction should propagate to its intended family without flattening meaningful differences.

When the project generates styles from utilities, check the compiled result before treating a mismatch as a design failure. Verify that variant classes are discoverable by the build and that runtime values reach an appropriate variable or style channel. Inspect the winning declaration and theme scope; rearranging class names does not establish cascade precedence. Repair missing generation, scope or conflicting ownership before adding overrides. After a reset, semantic markup alone may not restore visible heading or list cues; inspect presentation and accessibility exposure when default styling changes. Keep exact syntax and browser support grounded in the installed toolchain's official guidance rather than importing a generic configuration recipe.

## Retain the reasoning

Keep decisions in the project's existing design note or system documentation. Link each consequential recurring role to the styles or components that implement it, its rationale and the condition that would change it. For example: “Navigation selection uses a neutral surface so conversation content leads; keep the location recognizable under keyboard focus.” This is an example rationale, not a default palette.

Treat pre-build rules as provisional. Retain rules as the shared system after inspecting their repeated use in the working interface; accidental or defective output does not become a standard merely because it exists. Capture observations that change a reusable decision, distinguishing observation from explanation. Update the rule, implementation and rationale together; leave a local exception local when its cause is local.

When sources disagree, preserve version and platform scope and inspect the installed implementation. Brand voice, numeric thresholds and host policies are local contracts. A valid component API alone cannot establish a successful design.
