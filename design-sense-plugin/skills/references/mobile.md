# Touch and mobile flows

Model navigation as destinations and history before selecting tabs, stacks, sheets or drawers. Back should have a predictable target and preserve useful state. Distinguish dismissing a temporary surface from abandoning an edit.

For handheld or interrupted use, consult [conditions of use](../knowledge/use-context.md) before assuming reach, posture or attention. For mixed input, use [responding to constraints](../knowledge/constraint-response.md); a narrow screen does not assign the person one input mode.

Distinguish destination navigation, sibling content panels, list filters and field choices before styling a horizontal control. Underlines, segments and chips are treatments, not interchangeable semantics. Keep peers consistent; vary treatment when scope or behavior changes, not to manufacture variety. Panel tabs need their panel relationship and keyboard behavior; choosing a duration remains an input even if it resembles a tab. Keep long option sets reachable without shrinking labels.

For dates, use [date selection](../knowledge/date-selection.md) to choose entry, a nearby strip or calendar browsing and preserve the selected period. Inspect the opened picker and return state; setting its value alone does not verify its mobile interaction.

Prioritize the current task within a small viewport; adapt composition rather than shrinking a desktop tool. Persistent navigation competes with content and the software keyboard. Test safe areas, focus visibility, keyboard overlap, scroll restoration and interruptions where the platform supports them.

In a staged task, decide whether orientation must explain the remaining work or only position in a known sequence. A current-step title with a compact progress bar can suit a short linear flow; named stages help when upcoming tasks or revisiting completed stages matter. Give the indicator an accessible meaning and distinguish stage position from time or effort remaining. Avoid repeating the current title in a separate band unless that band adds useful context. A self-evident task may need no separate progress indicator.

Give backgrounds, fixed controls and scrolling content appropriate bounds. A background may reach the edge while controls remain unobstructed; scrolling content needs enough end space to bring its last item fully into view. Apply inherited insets once. When a sheet's available height changes, coordinate its scroll region and fixed actions rather than shrinking everything together. A visible drag handle promises an actual supported gesture.

Choose persistence from what must remain available during the work: back navigation, stage orientation, comparison context, a filter or the current action. If orientation must survive scrolling, give it an owner in the compact navigation region. A compact header or section control may earn a fixed position while an introduction scrolls away. Assign its scroll owner, boundary and stacking order; account for every persistent band's occupied space. Inspect mid-scroll, the last item and reverse scrolling. Making every header sticky can consume the task area without improving orientation.

Browser chrome and the software keyboard can affect different viewport bounds. A dynamic viewport unit alone does not guarantee that a fixed composer clears the keyboard. Choose height behavior for the task, then observe focus, scrolling and fixed actions through keyboard opening and dismissal on the supported browser.

Use [disclosure cost](../knowledge/disclosure-cost.md) when choosing an anchored menu, sheet or separate destination. Retire overlays with their owning view and return to the intended task; the appearance of a temporary surface alone does not determine its lifetime.

Provide comfortable touch targets and alternatives to hover, precision drag and hidden gestures. Surface destructive outcomes and recovery without asking for redundant confirmations on routine reversible work. Keep semantic labels and screen-reader order aligned with the visual task order.

For custom gestures, resolve ownership among the page, a sheet and its scrolling content. Keep the active pointer and grab offset stable; define when scrolling hands control to dragging, and handle cancellation. Scope touch policies to the custom control so normal scrolling, pinch zoom and text selection remain available where needed. Gate hover-only effects by input capability and preserve visible press and focus feedback.

Test at least the primary journey, its back/cancel path, empty/error state and an interruption. A desktop browser's narrow viewport is responsive evidence; it is not proof of native device, assistive technology or virtual-keyboard behavior.
