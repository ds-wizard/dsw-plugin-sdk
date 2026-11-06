# Changelog

# 0.12.0 (2026-11-06)

- Dependencies brought up to date (zod 4.6, and for development TypeScript 6.0, ESLint 10, React 19.3)
- UI components on the wizard's design system, one module each under `ui/*` (`ui/Button`, `ui/Field`, `ui/Dialog`, …): text, layout, buttons, alerts, badges, fields, file upload, tables, lists, tabs, and the wizard's own date and Markdown fields; the components' words in `ui/Words`, the design tokens in `ui/tokens`
- Removed `ui/Flash` and `ui/ModalContent` (Bootstrap, which the 5.0 wizard does not have): use `ui/Alert` and the `ui/Dialog` parts
- `ui/SimpleFileImporter` is drawn with the design system (a `FileUpload`, the error under it); `label`, `errorMessage` and `formatError`'s result are strings now
- The package is built with code splitting and marked free of side effects, so a plugin carries only the modules it imports
- Plugin API 0.5: a knowledge model package and a document template are identified by one `id` instead of `organizationId` with `kmId` / `templateId`
- Plugin API 0.5: the user has `tenantRole` and `workspaceRole` (the role in the current workspace, or `null`) instead of `role`
- Plugin API 0.5: the workspace comes with what is in one: `workspaceUuid` on the project (`null` only in the preview of a library knowledge model) and on the document; the project importer and the knowledge model integration in a questionnaire get the `project`, and the integration in the editor gets the `knowledgeModelEditor` (`{ uuid, name, workspaceUuid }`)
- The wizard draws icons with Font Awesome 7: pick icon names from its free set (the older names still work as aliases); every icon is fixed-width, so `fa-fw` is no longer needed

# 0.11.0 (2026-09-23)

- Fix session helper

# 0.10.0 (2026-08-21)

- Added user data to plugin elements

# 0.9.2 (2026-08-04)

- Fixed knowledge model data schema

# 0.9.1 (2026-04-13)

- Fix exposing of requests module

# 0.9.0 (2026-04-13)

- Added Flash messages components
- Added requests and session helpers
- Removed legacy integration reply from project importers

# 0.8.0 (2026-03-25)

- Added plugin integrations to KM
- Updated dependencies
