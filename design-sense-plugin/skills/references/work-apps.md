# Work and data applications

Find the decision or operation the user repeats. Choose the main surface from the work: comparing records often benefits from a table; changing a single entity from a focused form; understanding relationships from a graph or linked detail. A dashboard is useful only if its information changes a decision.

For numerical comparisons, trends or analytical dashboards, use [charts](charts.md) to choose the encoding and verify that aggregation, scale and interaction preserve its meaning.

Model identity, relationships, status transitions, permissions and persistence. Keep route/filter/sort/selection state coherent when opening detail and returning. Global, collection, selected-set and individual actions need visibly different scope. Bulk edits must explain the affected set and recovery.

Use [information confidence](../knowledge/information-confidence.md) when counts, status explanations or role-specific views summarize the same records. Actions can differ by role; the facts they imply must agree.

For filtering, use immediate updates when each change is quick and interpretable; batch changes when intermediate combinations are unhelpful or expensive. Distinguish edited conditions from the applied scope of displayed results. Keep applied conditions intelligible when controls close, make clearing predictable, and preserve the continuation point during refinement.

For requirements engineering, preserve requirement IDs, source, rationale, version, links to design/test evidence and change impact. For databases, distinguish browsing from editing, query execution from saved definition, and partial results from completeness. For workflow operations, represent progress, failure, retry and the user's next action.

Use real-looking content variety: long names, empty values, error/status combinations, many rows and no results. Provide discoverable search/filter and clear empty-state recovery. Inspect keyboard traversal, overflow, pagination or virtualization as applicable. A drawer should support staying in context; a page should support a deep task or stable destination. Choose deliberately.
