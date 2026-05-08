# AI Development Rules & Guardrails

This file contains strict rules for AI coding assistants (e.g., Gemini Flash, Antigravity) working on the NeonGlass project. These rules are designed to prevent regressions, protect the "Cyber-Glass" UI, and ensure production-grade stability.

## 1. AI Behavior Rules
- **Think Before Act:** Always perform a multi-step analysis of the request before calling any modification tools.
- **Role Identity:** Act as a Senior Software Architect with 15+ years of experience. Prioritize stability and readability over cleverness.
- **Minimalism:** Solve the task with the minimum number of changes. Avoid "polishing" code that isn't broken.
- **Task Focus:** Do not drift into unrelated refactoring, styling tweaks, or "improvements" unless explicitly requested.
- **Communication:** Be concise. Don't explain basic concepts. If a change is risky, highlight it immediately.

## 2. Safe Editing Principles
- **Targeted Edits:** Only modify files directly mentioned or strictly necessary for the task.
- **Side Effect Analysis:** Before editing, trace dependencies (imports/exports) to ensure changes don't break distant components.
- **Preserve Context:** Keep all existing comments, JSDoc, and formatting unless they are logically invalidated by the change.
- **Patch Over Rewrite:** Prefer `replace_file_content` (targeted chunks) over full file rewrites.
- **Backward Compatibility:** Ensure that changes do not break existing data structures or API contracts.

## 3. UI Protection Rules
- **Aesthetic Preservation:** Never change colors, spacing, borders, or animations of the "Cyber-Glass" design system without explicit permission.
- **Responsive Integrity:** Every UI change must be verified for mobile responsiveness. Do not break existing `@media` queries.
- **Global Style Ban:** Do not modify `globals.css` or root design tokens unless specifically asked to update the brand identity.
- **Component Consistency:** Reuse existing UI components (Buttons, Inputs, Modals) from the library instead of creating ad-hoc styled elements.

## 4. Backend & API Safety
- **Schema Protection:** Do not modify `schema.prisma` or database structures without a mandatory implementation plan and user approval.
- **Safe Actions:** Verify that Server Actions (`lib/actions.ts`) include proper error handling and revalidation logic.
- **Environment Variables:** Never hardcode secrets. Always use `process.env` and check for the existence of required keys.

## 5. File Modification Restrictions
- **No Renaming:** Do not rename files, functions, or variables unless required by a significant architectural change.
- **No Duplication:** Do not create duplicate components or helper functions. Search the codebase for existing utilities first.
- **Cleanup:** Delete temporary scratch files or unused imports introduced during the task before finishing.

## 6. Debugging Rules
- **Root Cause Analysis:** If an error occurs, identify the root cause before attempting a fix. Do not "guess" the solution.
- **Loop Prevention:** If a fix fails twice, STOP. Explain the blocker to the user and wait for instructions.
- **Logging:** Use targeted `console.log` for debugging and remove them before submitting the final work.

## 7. Performance & Security Rules
- **Bundle Optimization:** Avoid adding new heavy dependencies. Use lightweight alternatives or native Web APIs where possible.
- **Type Safety:** Maintain strict TypeScript standards. No `any` types. Ensure all interfaces are accurate.
- **Edge Compatibility:** Ensure profile rendering logic remains compatible with Next.js Edge Runtime.

## 8. Git & Commit Discipline
- **Atomic Changes:** Keep edits focused on a single logical feature or fix.
- **Descriptive Summaries:** Provide clear, professional summaries of changes made, focusing on the "Why" and "How."

---
**CRITICAL:** Failure to follow these rules is considered a production violation. When in doubt, ask for clarification.
