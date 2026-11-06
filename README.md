# DSW Plugin SDK

_SDK for creating plugins for DS Wizard._

- [Get Started](#get-started)
- [How It Works](#how-it-works): the plugin, its settings, the builder
- [Connectors](#connectors): document action, knowledge model integration, project action, project importer, project question action, project tab, settings, user settings
- [What the Connectors Get](#what-the-connectors-get): the user, the project, the document, patterns
- [Calling the Wizard's API](#calling-the-wizards-api)
- [UI Components](#ui-components): the wizard's design system in React, with examples
- [Compatibility](#compatibility)

## Get Started

Get started by choosing one of the plugin templates and following the instructions there:

- [DSW Plugin Template](https://github.com/ds-wizard/dsw-plugin-template) for simple plugins.
- [DSW Plugin Service Template](https://github.com/ds-wizard/dsw-plugin-service-template) for plugins that require custom backend in [Engine Gateway](https://github.com/ds-wizard/engine-gateway).

## How It Works

The plugin is defined by its metadata and its connectors to various parts of the wizard. Then, after installation, it is loaded by the wizard and displayed where defined to provide additional functionality.

### Plugin Definition

The first part of the plugin definition is the metadata. This is prepared in the `metadata.ts` file in the templates. Fill in the details about your plugin there. You can use [UUID Generator](https://www.uuidgenerator.net) to generate a unique UUID for the plugin.

```ts
import { PluginMetadata } from '@ds-wizard/plugin-sdk/types'

export const pluginMetadata: PluginMetadata = {
    uuid: '<uuid>',
    name: 'DSW Plugin',
    version: '1.0.0',
    description: 'This is a DSW Plugin created from the template.',
}
```

Then, there is the actual plugin definition, prepared in the `plugin.ts` file in templates. There's the default exported function that creates the plugin using the settings and user settings.

```ts
export default function (settingsInput: unknown, userSettingsInput: unknown): Plugin {
    // Initialize the plugin here
    return plugin
}
```

The plugin can use custom **Settings** and **UserSettings** if needed. Settings refer to global settings accessible from wizard settings, while user settings are specific to each user and accessible from user details. These values are then available in every connector. However, these are not mandatory, and not every plugin will need to use them.

### Plugin Builder

The plugin is created using the `PluginBuilder`. There are two options, based on whether you use the aforementioned settings or not:

```ts
import { PluginBuilder } from '@ds-wizard/plugin-sdk/core'

const plugin = PluginBuilder.create(pluginMetadata, SettingsDataCodec, UserSettingsDataCodec)
    // Add connectors here
    .createPlugin()

const plugin = PluginBuilder.createWithNoSettings(pluginMetadata)
    // Add connectors here
    .createPlugin()
```

Then, the connectors are chained to this using the `PluginBuilder` as well.

### Settings and User Settings

The types for settings are defined using the [zod](https://zod.dev) library, as they need to be parsed first. There are prepared files for that in the templates in the _data_ directory.

```ts
import { makeJsonCodec } from '@ds-wizard/plugin-sdk/utils'
import { z } from 'zod'

export const SettingsDataSchema = z.object({
    repositoryUrl: z.string(),
})

export type SettingsData = z.infer<typeof SettingsDataSchema>

export const SettingsDataCodec = makeJsonCodec(SettingsDataSchema, { repositoryUrl: '' })
```

If you only need to use one type of settings, you can use the `makeNullCodec` helper for the other, so you don't have to define it.

```ts
const plugin = PluginBuilder.create(pluginMetadata, SettingsDataCodec, makeNullCodec())
    // Add connectors here
    .createPlugin()
```

## Connectors

Connectors are used to connect the plugin to pre-defined places in the wizard application. They usually consist of a button definition and a component that is then rendered, providing the plugin's functionality.

Each component must have the expected type annotation to be compliant with the connector. It is a React component; the examples below draw it with the SDK's [UI components](#ui-components), so it looks like the rest of the wizard.

The React component is then rendered within a custom web component. You need to give this web component a name within the connector definition. Try to make this **universally unique** to avoid clashes with other plugins. For example, include the plugin name, such as `x-plugin-name-component-name`. Also, use kebab case for the naming.

One plugin can provide multiple connectors of the same type. Each web component for each action must have a unique name.

Every component gets `settings` and `userSettings` (the plugin's, parsed with your codecs), and most get the `user` who is signed in; see [What the Connectors Get](#what-the-connectors-get) for the shapes.

### Document Action

The Document Action connector adds an action with an icon to the documents' context menu. The action opens a dialog that renders the plugin component. Optionally, the document action can be limited to only a selection of document templates or document formats.

```ts
const plugin = PluginBuilder.create(...)
    .addDocumentAction(
        'fas fa-envelopes-bulk', // Font Awesome icon
        'Send to Repository', // action name
        'x-plugin-name-document-action', // web component name
        DocumentAction, // React component with plugin functionality
        ['dsw.questionnaire-report:>=2.16.0'], // (optional) supported document templates (patterns)
        ['a9293d08-59a4-4e6b-ae62-7a6a570b031c'], // (optional) supported format UUIDs
    )
```

The React component has the following input:

- `settings` - custom plugin global settings
- `userSettings` - custom plugin user settings
- `user` - the user who is signed in
- `document` - the document, as defined in [document-data.ts](src/data/document-data.ts)
- `onActionClose` - call to close the dialog

The dialog is the plugin's, all of it: the wizard draws no title and no buttons of its own, so the component draws them with the dialog parts.

```tsx
import { DocumentActionComponentProps } from '@ds-wizard/plugin-sdk/elements'
import { Button } from '@ds-wizard/plugin-sdk/ui/Button'
import { DialogBody, DialogFooter, DialogHeader } from '@ds-wizard/plugin-sdk/ui/Dialog'
import { Body } from '@ds-wizard/plugin-sdk/ui/Text'

export default function DocumentAction({
    document,
    onActionClose,
}: DocumentActionComponentProps<SettingsData, UserSettingsData>) {
    return (
        <>
            <DialogHeader title="Send to the repository" />
            <DialogBody>
                <Body>{document?.name} will be sent to the repository.</Body>
            </DialogBody>
            <DialogFooter>
                <Button variant="ghost" onClick={onActionClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onActionClose}>
                    Send
                </Button>
            </DialogFooter>
        </>
    )
}
```

### Knowledge Model Integration

The Knowledge Model Integration connector adds two components: one for the knowledge model editor to set up the integration, and a second for the questionnaire to choose a reply and, optionally, to render the chosen reply.

```ts
const plugin = PluginBuilder.create(...)
    .addKnowledgeModelIntegration(
        'Plugin Integration', // the integration's name, offered in the editor
        'plugin-integration', // ID of the integration to distinguish multiple integrations by the same plugin
        PluginIntegrationSettingsDataCodec, // data codec for the plugin integration settings
        'x-plugin-integration-editor', // name of the web component for the KM editor
        PluginIntegrationEditor, // React component for the KM editor
        'x-plugin-integration-selection', // name of the web component for the questionnaire
        PluginIntegrationSelection, // React component for the questionnaire
        true, // (optional) if true, the plugin renders the reply; otherwise the default Markdown is used
    )
```

The React component for the knowledge model editor has the following input:

- `settings`, `userSettings`, `user`
- `knowledgeModelEditor` - the editor it is set up in: `{ uuid, name, workspaceUuid }`
- `pluginIntegrationSettings` - the integration's settings, or `null` before there are any
- `onPluginIntegrationSettingsChange` - call when the settings change; the wizard saves them

```tsx
import { KnowledgeModelIntegrationEditorComponentProps } from '@ds-wizard/plugin-sdk/elements'
import { TextField } from '@ds-wizard/plugin-sdk/ui/Field'
import { Stack } from '@ds-wizard/plugin-sdk/ui/Layout'

export default function PluginIntegrationEditor({
    pluginIntegrationSettings,
    onPluginIntegrationSettingsChange,
}: KnowledgeModelIntegrationEditorComponentProps<SettingsData, UserSettingsData, IntegrationData>) {
    return (
        <Stack>
            <TextField
                label="Collection"
                value={pluginIntegrationSettings?.collection ?? ''}
                onChange={(collection) => onPluginIntegrationSettingsChange({ collection })}
                hint="Which collection the questionnaire searches."
            />
        </Stack>
    )
}
```

The React component for the questionnaire has the following input:

- `settings`, `userSettings`, `user`
- `project` - the project the questionnaire is in
- `pluginIntegrationSettings` - the integration's settings, as set up in the editor
- `integrationReply` - the reply chosen so far, as defined in [integration-reply-data.ts](src/data/integration-reply-data.ts), or `null`
- `onReplyChange` - call when a reply is chosen

```tsx
import { createIntegrationReply } from '@ds-wizard/plugin-sdk/data'
import { KnowledgeModelIntegrationQuestionnaireComponentProps } from '@ds-wizard/plugin-sdk/elements'
import { Button } from '@ds-wizard/plugin-sdk/ui/Button'
import { Inline } from '@ds-wizard/plugin-sdk/ui/Layout'

export default function PluginIntegrationSelection({
    onReplyChange,
}: KnowledgeModelIntegrationQuestionnaireComponentProps<
    SettingsData,
    UserSettingsData,
    IntegrationData
>) {
    // the reply: Markdown to show, and the raw value to keep
    const reply = createIntegrationReply('**Example reply**\n\nContaining a Markdown text', {
        value: 'Example raw value',
        id: 25,
    })

    return (
        <Inline>
            <Button onClick={() => onReplyChange(reply)}>Choose the example reply</Button>
        </Inline>
    )
}
```

### Project Action

The Project Action connector adds an action to the project's actions on the project detail page. The action opens a dialog that renders the plugin component. Optionally, the project action can be limited to only a selection of knowledge models.

```ts
const plugin = PluginBuilder.create(...)
    .addProjectAction(
        'Action Name',
        'x-plugin-name-project-action', // web component name
        ProjectAction, // React component with plugin functionality
        ['dsw.root:^2'], // (optional) supported knowledge models (patterns)
    )
```

The React component has the following input:

- `settings`, `userSettings`, `user`
- `project` - the project, as defined in [project-common-data.ts](src/data/project-common-data.ts)
- `onActionClose` - call to close the dialog

As with a document action, the component draws the whole dialog.

```tsx
import { ProjectActionComponentProps } from '@ds-wizard/plugin-sdk/elements'
import { Button } from '@ds-wizard/plugin-sdk/ui/Button'
import { DialogBody, DialogFooter, DialogHeader } from '@ds-wizard/plugin-sdk/ui/Dialog'
import { Body } from '@ds-wizard/plugin-sdk/ui/Text'

export default function ProjectAction({
    project,
    onActionClose,
}: ProjectActionComponentProps<SettingsData, UserSettingsData>) {
    return (
        <>
            <DialogHeader title="Project report" />
            <DialogBody>
                <Body>A report about {project?.name}.</Body>
            </DialogBody>
            <DialogFooter>
                <Button variant="secondary" onClick={onActionClose}>
                    Close
                </Button>
            </DialogFooter>
        </>
    )
}
```

### Project Importer

The Project Importer connector implements an importer of replies from other sources into the project's questionnaire. It defines the importer's name and the component that handles the import. Optionally, it can be limited to only a selection of knowledge models.

The importer also defines its URL, which is used as the last part of the project URL when the importer is open. Make it plugin-specific to avoid clashes with other plugins.

```ts
const plugin = PluginBuilder.create(...)
    .addProjectImporter(
        'Importer Name',
        'importer-url', // importer URL
        'x-plugin-name-project-importer', // web component name
        ProjectImporterComponent, // React component with plugin functionality
        ['dsw.root:^2'], // (optional) supported knowledge models (patterns)
    )
```

The React component has the following input:

- `settings`, `userSettings`, `user`
- `knowledgeModel` - the project's knowledge model, as defined in [knowledge-model-data.ts](src/data/knowledge-model-data.ts)
- `project` - the project imported into
- `onImport` - call with the events made by a `ProjectImporter` to continue the import in the wizard, which shows what would change before anything is changed

The importer is drawn on the importer's page, which the wizard pads as every page.

```tsx
import { ProjectImporterComponentProps } from '@ds-wizard/plugin-sdk/elements'
import { ProjectImporter } from '@ds-wizard/plugin-sdk/project-importer'
import { Button } from '@ds-wizard/plugin-sdk/ui/Button'
import { Inline, Stack } from '@ds-wizard/plugin-sdk/ui/Layout'
import { Body, Title } from '@ds-wizard/plugin-sdk/ui/Text'

export default function ProjectImporterComponent({
    onImport,
}: ProjectImporterComponentProps<SettingsData, UserSettingsData>) {
    const importReplies = () => {
        const importer = new ProjectImporter()
        importer.setReply([chapterUuid, questionUuid], 'Imported value')
        onImport(importer.getEvents())
    }

    return (
        <Stack>
            <Title>Import from the service</Title>
            <Body>Fills in the questionnaire with what the service knows about the project.</Body>
            <Inline>
                <Button variant="primary" onClick={importReplies}>
                    Import
                </Button>
            </Inline>
        </Stack>
    )
}
```

An importer that only needs a file, which it parses into replies, is a [`SimpleFileImporter`](#a-file-importer).

#### Making the Events

`ProjectImporter` makes the events the wizard imports. A reply is addressed by its question path, a list of UUIDs: the chapter, then the questions, items and answers on the way to the question.

```ts
import { KMHelper, ProjectImporter } from '@ds-wizard/plugin-sdk/project-importer'

const importer = new ProjectImporter()

// A value question: the value
importer.setReply(questionPath, 'value')

// An options question: the UUID of the answer
importer.setReply(questionPath, answerUuid)

// A multi-choice question: the UUIDs of the choices
importer.setListReply(questionPath, [choiceUuid1, choiceUuid2])

// A list question: add an item, then use its UUID in the paths of the item's questions
const itemUuid = importer.addItem(questionPath)
importer.setReply([...questionPath, itemUuid, itemQuestionUuid], 'Lee Harris')

// An item select question: the UUID of the item it points to
importer.setItemSelectReply(questionPath, itemUuid)

// An integration question: a plain reply with setReply, or one that behaves
// as if it came from the integration, with its raw data
importer.setIntegrationReply(questionPath, 'Czech Technical University in Prague', {
    name: 'Czech Technical University in Prague',
    url: 'https://ror.org/03kqpb082',
})

// The events to hand to onImport
const events = importer.getEvents()
```

Instead of hard-coding UUIDs, a plugin can find the knowledge model's entities by their annotations with `KMHelper`:

```ts
const km = new KMHelper(knowledgeModel)
const chapterUuid = km.getChapterUuidByAnnotation('importer', 'general')
const questionUuid = km.getQuestionUuidByAnnotation('importer', 'title')
```

### Project Question Action

The Project Question Action connector adds a button with an icon and a tooltip to each question, which opens a dialog or a side panel with the plugin component. Optionally, it can be limited to only a selection of knowledge models.

```ts
const plugin = PluginBuilder.create(...)
    .addProjectQuestionAction(
        'far fa-window-restore', // Font Awesome icon
        'Open modal', // tooltip label
        'modal', // where to open the component: 'modal' | 'sidebar'
        'x-plugin-name-project-question-action', // web component name
        ProjectQuestionAction, // React component with plugin functionality
        ['dsw.root:^2'], // (optional) supported knowledge models (patterns)
    )
```

The React component has the following input:

- `settings`, `userSettings`, `user`
- `project` - the project
- `question` - the question, as defined in [question-data.ts](src/data/question-data.ts)
- `questionPath` - the path to the question the action was opened from
- `onActionClose` - call to close the dialog or the panel

In a dialog, the component draws the whole dialog (`ui/Dialog`), as a document action does. In the side panel, the wizard titles the panel with the action's name, gives it a close button and leaves the content edge to edge: content whose root is a `Stack` gets the padding of the wizard's own panels, and a root element of your own is left as drawn.

```tsx
import { ProjectQuestionActionComponentProps } from '@ds-wizard/plugin-sdk/elements'
import { Stack } from '@ds-wizard/plugin-sdk/ui/Layout'
import { Body, Code } from '@ds-wizard/plugin-sdk/ui/Text'

// opened with 'sidebar'
export default function ProjectQuestionActionPanel({
    question,
    questionPath,
}: ProjectQuestionActionComponentProps<SettingsData, UserSettingsData>) {
    return (
        <Stack>
            <Body>Guidance for “{question?.title}”.</Body>
            <Body>
                Path: <Code>{questionPath}</Code>
            </Body>
        </Stack>
    )
}
```

### Project Tab

The Project Tab connector adds a new tab to the project detail. Optionally, it can be limited to only a selection of knowledge models.

The tab also defines its URL, which is used as the last part of the project URL when the tab is open. Make it specific to the plugin to avoid clashes with other plugins.

```ts
const plugin = PluginBuilder.create(...)
    .addProjectTab(
        'fas fa-house', // Font Awesome tab icon
        'Home', // tab name
        'tab-url', // tab URL
        'x-plugin-name-project-tab', // web component name
        ProjectTab, // React component with plugin functionality
        ['dsw.root:^2'], // (optional) supported knowledge models (patterns)
    )
```

The React component has the following input:

- `settings`, `userSettings`, `user`
- `project` - the project

The tab gives the plugin the whole area under the project's header, edge to edge and without padding, and scrolls it when the plugin is longer, as the document preview does. Content whose root is a `Stack` gets the standard padding, lined up with the project's title; a root element of your own is left as drawn, for no padding. The plugin's element and the box it is mounted in are the area's height, so a component that should fill it, with scrolling regions of its own, can be `height: 100%`.

```tsx
import { ProjectTabComponentProps } from '@ds-wizard/plugin-sdk/elements'
import { Stack } from '@ds-wizard/plugin-sdk/ui/Layout'
import { Body, Title } from '@ds-wizard/plugin-sdk/ui/Text'

export default function ProjectTab({
    project,
}: ProjectTabComponentProps<SettingsData, UserSettingsData>) {
    return (
        <Stack loose>
            <Title>Project overview</Title>
            <Body>Everything the plugin knows about {project?.name}.</Body>
        </Stack>
    )
}
```

### Settings

The Settings connector defines how the plugin's settings are set, in the wizard's settings. A plugin can only have one.

```ts
const plugin = PluginBuilder.create(...)
    .addSettings(
        'x-plugin-name-settings', // web component name
        Settings, // React component with plugin functionality
    )
```

The React component has the following input:

- `settings` - custom plugin global settings
- `onSettingsChange` - call when the settings change; the wizard saves them with the rest of the form

```tsx
import { SettingsComponentProps } from '@ds-wizard/plugin-sdk/elements'
import { TextField } from '@ds-wizard/plugin-sdk/ui/Field'
import { Stack } from '@ds-wizard/plugin-sdk/ui/Layout'

export default function Settings({
    settings,
    onSettingsChange,
}: SettingsComponentProps<SettingsData>) {
    return (
        <Stack>
            <TextField
                label="Repository URL"
                type="url"
                value={settings.repositoryUrl}
                onChange={(repositoryUrl) => onSettingsChange({ ...settings, repositoryUrl })}
            />
        </Stack>
    )
}
```

### User Settings

The User Settings connector defines how a user's own plugin settings are set, in the user's settings. A plugin can only have one.

```ts
const plugin = PluginBuilder.create(...)
    .addUserSettings(
        'x-plugin-name-user-settings', // web component name
        UserSettings, // React component with plugin functionality
    )
```

The React component has the following input:

- `settings` - custom plugin global settings
- `userSettings` - custom plugin user settings
- `user` - the user whose settings these are
- `onUserSettingsChange` - call when the user settings change

```tsx
import { UserSettingsComponentProps } from '@ds-wizard/plugin-sdk/elements'
import { SecretField } from '@ds-wizard/plugin-sdk/ui/Field'
import { Stack } from '@ds-wizard/plugin-sdk/ui/Layout'

export default function UserSettings({
    userSettings,
    onUserSettingsChange,
}: UserSettingsComponentProps<SettingsData, UserSettingsData>) {
    return (
        <Stack>
            <SecretField
                label="API token"
                value={userSettings.apiToken}
                onChange={(apiToken) => onUserSettingsChange({ ...userSettings, apiToken })}
                hint="Your own token for the repository."
            />
        </Stack>
    )
}
```

## What the Connectors Get

The data the wizard hands a component is decoded by the SDK and typed; what cannot be decoded is `null`.

- **`user`** ([user-data.ts](src/data/user-data.ts)): `uuid`, `email`, `firstName`, `lastName`, `imageUrl`, `affiliation`, and two roles, each `{ uuid, name, permissions }`: `tenantRole`, which holds everywhere, and `workspaceRole`, the role in the workspace the user is in, or `null` where they have none.
- **`project`** ([project-common-data.ts](src/data/project-common-data.ts)): `uuid`, `name`, `isTemplate`, `knowledgeModelPackage` (`{ uuid, id, name, version, … }`) and `workspaceUuid`, the workspace the project is in.
- **`document`** ([document-data.ts](src/data/document-data.ts)): the document, its project, its template and format, its state, and its `workspaceUuid`.

**Patterns.** The knowledge models and document templates a connector is for are given as patterns of their id and version: `dsw.root:^2` is any version 2 of `dsw.root`, `dsw.root:2.4.0` exactly that one, and `*:^2` any knowledge model of version 2. Versions take npm-style ranges: `^`, `~`, `>=`, `<`, `1.2.3 - 1.4.0`, `1.x`. A pattern of three parts, from before a thing had one id, still works: `dsw:root:^2` is `dsw.root:^2`.

## Calling the Wizard's API

A plugin can call the wizard's API as the user who is signed in. `getApiUrlAndToken` reads the API's address and the user's token from the wizard's session, and `requestJson` sends a request and checks the answer with a zod schema:

```ts
import { getApiUrlAndToken, requestJson } from '@ds-wizard/plugin-sdk/requests'
import { z } from 'zod'

const ProjectSchema = z.object({ uuid: z.string(), name: z.string() })

async function loadProject(projectUuid: string) {
    const { apiUrl, token } = getApiUrlAndToken()
    return requestJson(`${apiUrl}/projects/${projectUuid}`, ProjectSchema, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
}
```

What is addressed by its UUID needs nothing more. A list, or something created, within a workspace names it with `w`: `${apiUrl}/projects?w=${project.workspaceUuid}`. The project and the document a connector gets carry their `workspaceUuid` for that.

## UI Components

The SDK has React components that draw the wizard's own design system, so a plugin looks and behaves like the rest of the application — in light and dark mode, in the instance's colors — without a stylesheet of its own. A plugin's elements are drawn inside the wizard's page, and the components write the markup the wizard's stylesheet styles. They need the wizard around them (5.0 or newer) and draw unstyled anywhere else.

Each is a module of its own, so a plugin carries only what it imports:

```ts
import { Button } from '@ds-wizard/plugin-sdk/ui/Button'
import { TextField } from '@ds-wizard/plugin-sdk/ui/Field'
```

| Module | Components |
| ------ | ---------- |
| `ui/Alert` | `Alert` (`info`, `success`, `warning`, `danger`, `private`) |
| `ui/AsyncBlock` | `AsyncBlock` — loading, error, content |
| `ui/Badge` | `Badge` |
| `ui/Button` | `Button`, `SubmitButton`, `IconButton`, `LinkButton` |
| `ui/Card` | `Card` |
| `ui/Copy` | `Copy`, `CopyTextButton` |
| `ui/DateField` | `DateField`, `DateTimeField`, `TimeField` — the wizard's own date picker |
| `ui/DescriptionList` | `DescriptionList` |
| `ui/Dialog` | `DialogHeader`, `DialogBody`, `DialogFooter`, `DialogForm` — what an action draws in the dialog the wizard opens for it |
| `ui/EmptyState` | `EmptyState` |
| `ui/Field` | `TextField`, `TextareaField`, `SelectField`, `PasswordField`, `SecretField`, `ReadOnlyField`, `CheckboxField`, `ToggleField`, `RadioGroup`, `CheckboxGroup`, `FieldGroup` |
| `ui/FileUpload` | `FileUpload` |
| `ui/Form` | `FormActions`, `ErrorSummary`, `FormCollapsible`, `FormNested`, `ReadOnlyForm` |
| `ui/Icon` | `Icon`, `Spinner` (Font Awesome, as the wizard has it) |
| `ui/ItemIcon` | `ItemIcon` — initials over the color the wizard gives the same name |
| `ui/Layout` | `Stack`, `Inline`, `Grid`, `Split`, `Center` |
| `ui/Link` | `Link`, `ActionLink` |
| `ui/ListItem` | `List`, `ListItem` |
| `ui/MarkdownField` | `MarkdownField` — the wizard's own Markdown editor |
| `ui/ProgressBar` | `ProgressBar`, `towardsLimit` |
| `ui/Prose` | `Prose` — rendered Markdown or HTML |
| `ui/Separator` | `Separator` |
| `ui/SimpleFileImporter` | `SimpleFileImporter` — a whole project importer for a file |
| `ui/Table` | `Table` |
| `ui/Tabs` | `Tabs`, `TabPanel` |
| `ui/Tag` | `Tag`, `TagList` |
| `ui/Text` | `Title`, `Subtitle`, `Body`, `BodySmall`, `Muted`, `Label`, `Code`, `ErrorText`, `VisuallyHidden` |
| `ui/Tooltip` | `Tooltip` |
| `ui/tokens` | `token('--ui-space-3')` — the design tokens, for a plugin's own styles |
| `ui/Words` | `UiWordsProvider`, `useUiWords`, `englishUiWords` |

How they behave:

- **The props are the way to a look** (`variant`, `size`, `tone`). Every component also takes `className` and `style` for its root element, added to the design system's classes, and passes `id`, `aria-*` and `data-*` through.
- **A `Stack` at the root** of a project tab or a side panel gets the wizard's padding there; nothing else is padded for you.
- **Fields are controlled**: they show `value` and report changes with `onChange`. Each builds its label, hint and error and ties them to the control, so they are read out together; `id` is the control's, generated when not given.
- **The components' own words** — Close, Loading…, the name of a remove button — are English. A plugin that translates gives its words once, with `UiWordsProvider`; a component's prop overrides them in one place.

### Text and Layout

`Stack` puts its parts one under another, `Inline` in a row that wraps (`align="between"` or `"end"`), `Grid` in columns, `Split` two areas side by side. The space between them is the design system's; there are no margins to set.

```tsx
import { Badge } from '@ds-wizard/plugin-sdk/ui/Badge'
import { Card } from '@ds-wizard/plugin-sdk/ui/Card'
import { Grid, Inline, Stack } from '@ds-wizard/plugin-sdk/ui/Layout'
import { Body, Code, Muted, Title } from '@ds-wizard/plugin-sdk/ui/Text'

export function Overview() {
    return (
        <Stack loose>
            <Inline align="between">
                <Title>Datasets</Title>
                <Badge tone="success">Synchronized</Badge>
            </Inline>
            <Body>
                Three datasets from <Code>repository.example.org</Code>.{' '}
                <Muted>Updated today.</Muted>
            </Body>
            <Grid>
                <Card title="Raw data">
                    <Body>12 files</Body>
                </Card>
                <Card title="Processed">
                    <Body>4 files</Body>
                </Card>
            </Grid>
        </Stack>
    )
}
```

### Buttons, Alerts and Feedback

```tsx
import { Alert } from '@ds-wizard/plugin-sdk/ui/Alert'
import { Button, IconButton, LinkButton } from '@ds-wizard/plugin-sdk/ui/Button'
import { Inline, Stack } from '@ds-wizard/plugin-sdk/ui/Layout'
import { useState } from 'react'

export function Sync() {
    const [state, setState] = useState<'idle' | 'busy' | 'done' | 'failed'>('idle')
    const sync = () => {
        setState('busy')
        fetch('https://repository.example.org/sync', { method: 'POST' })
            .then((res) => setState(res.ok ? 'done' : 'failed'))
            .catch(() => setState('failed'))
    }

    return (
        <Stack>
            {state === 'failed' && (
                <Alert tone="danger">The repository could not be reached.</Alert>
            )}
            <Inline>
                <Button
                    variant="primary"
                    icon="fa-rotate"
                    loading={state === 'busy'}
                    done={state === 'done'}
                    onClick={sync}
                >
                    Synchronize
                </Button>
                <LinkButton href="https://repository.example.org" external>
                    Open the repository
                </LinkButton>
                <IconButton icon="fa-gear" label="Repository settings" tooltip />
            </Inline>
        </Stack>
    )
}
```

A button that cannot be used now says why with `disabledReason` rather than `disabled`, so a keyboard and a screen reader learn it too: `disabledReason={{ id: 'sync-reason', reason: 'Nothing to synchronize' }}`.

`AsyncBlock` is what is fetched: a spinner while it loads, a danger alert if it fails, the content once it is there.

```tsx
import { AsyncBlock } from '@ds-wizard/plugin-sdk/ui/AsyncBlock'
import { Body } from '@ds-wizard/plugin-sdk/ui/Text'

export function Datasets({
    loading,
    error,
    count,
}: {
    loading: boolean
    error?: string
    count: number
}) {
    return (
        <AsyncBlock loading={loading} error={error}>
            <Body>{count} datasets</Body>
        </AsyncBlock>
    )
}
```

### Forms

Fields take a `label`, the `value` and `onChange`, and optionally a `hint`, an `error` and `required`. Save is never disabled because the form is not valid yet: it is pressed, and what is wrong is said, beside the fields and in an `ErrorSummary` above them.

```tsx
import { Button, SubmitButton } from '@ds-wizard/plugin-sdk/ui/Button'
import { CheckboxField, RadioGroup, SelectField, TextField } from '@ds-wizard/plugin-sdk/ui/Field'
import { ErrorSummary, FormActions } from '@ds-wizard/plugin-sdk/ui/Form'
import { Stack } from '@ds-wizard/plugin-sdk/ui/Layout'
import { useState } from 'react'

export function DepositForm({ onDone }: { onDone: () => void }) {
    const [title, setTitle] = useState('')
    const [license, setLicense] = useState('cc-by')
    const [access, setAccess] = useState('open')
    const [notify, setNotify] = useState(true)
    const [submitted, setSubmitted] = useState(false)
    const titleError = submitted && !title ? 'The deposit needs a title.' : undefined

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                setSubmitted(true)
                if (title) onDone()
            }}
        >
            <Stack>
                <ErrorSummary errors={titleError ? [titleError] : []} />
                <TextField
                    label="Title"
                    value={title}
                    onChange={setTitle}
                    required
                    error={titleError}
                />
                <SelectField
                    label="License"
                    value={license}
                    onChange={setLicense}
                    options={[
                        { value: 'cc-by', label: 'CC BY 4.0' },
                        { value: 'cc0', label: 'CC0 1.0' },
                    ]}
                />
                <RadioGroup
                    label="Access"
                    value={access}
                    onChange={setAccess}
                    options={[
                        {
                            value: 'open',
                            label: 'Open',
                            description: 'Anybody can download the files.',
                        },
                        {
                            value: 'restricted',
                            label: 'Restricted',
                            description: 'Files on request.',
                        },
                    ]}
                />
                <CheckboxField
                    label="Notify me when it is published"
                    checked={notify}
                    onChange={setNotify}
                />
                <FormActions>
                    <SubmitButton variant="primary">Deposit</SubmitButton>
                    <Button variant="ghost" onClick={onDone}>
                        Cancel
                    </Button>
                </FormActions>
            </Stack>
        </form>
    )
}
```

The other fields work the same way: `TextareaField`, `PasswordField`, `SecretField` (hidden, with a button that shows it), `ReadOnlyField`, `ToggleField`, `CheckboxGroup` (`values` and `onChange` with the list), and `FieldGroup` for settings that belong together. `DateField`, `DateTimeField`, `TimeField` and `MarkdownField` are drawn by the wizard's own editors and work the same way too: a date is `2026-09-11`, a time `14:30`, a date and time an ISO-8601 instant.

In a dialog, a form is a `DialogForm` round the body and the footer, with a `SubmitButton`, so Enter sends it:

```tsx
import { DocumentActionComponentProps } from '@ds-wizard/plugin-sdk/elements'
import { Button, SubmitButton } from '@ds-wizard/plugin-sdk/ui/Button'
import { DialogBody, DialogFooter, DialogForm, DialogHeader } from '@ds-wizard/plugin-sdk/ui/Dialog'
import { TextareaField } from '@ds-wizard/plugin-sdk/ui/Field'
import { useState } from 'react'

export default function SendForReview({
    onActionClose,
}: DocumentActionComponentProps<SettingsData, UserSettingsData>) {
    const [message, setMessage] = useState('')
    return (
        <>
            <DialogHeader title="Send for review" />
            <DialogForm onSubmit={onActionClose}>
                <DialogBody>
                    <TextareaField
                        label="Message to the reviewer"
                        value={message}
                        onChange={setMessage}
                        rows={4}
                    />
                </DialogBody>
                <DialogFooter>
                    <Button variant="ghost" onClick={onActionClose}>
                        Cancel
                    </Button>
                    <SubmitButton variant="primary">Send</SubmitButton>
                </DialogFooter>
            </DialogForm>
        </>
    )
}
```

### Lists and Tables

```tsx
import { Badge } from '@ds-wizard/plugin-sdk/ui/Badge'
import { IconButton } from '@ds-wizard/plugin-sdk/ui/Button'
import { EmptyState } from '@ds-wizard/plugin-sdk/ui/EmptyState'
import { ItemIcon } from '@ds-wizard/plugin-sdk/ui/ItemIcon'
import { Link } from '@ds-wizard/plugin-sdk/ui/Link'
import { List, ListItem } from '@ds-wizard/plugin-sdk/ui/ListItem'
import { Table } from '@ds-wizard/plugin-sdk/ui/Table'

type Dataset = { id: string; name: string; url: string; files: number }

export function DatasetList({ datasets }: { datasets: Dataset[] }) {
    if (datasets.length === 0) {
        return (
            <EmptyState
                title="No datasets yet"
                description="Datasets you deposit will be listed here."
            />
        )
    }
    return (
        <List>
            {datasets.map((dataset) => (
                <ListItem
                    key={dataset.id}
                    icon={<ItemIcon name={dataset.name} />}
                    title={<Link href={dataset.url}>{dataset.name}</Link>}
                    fragments={[<Badge key="files">{dataset.files} files</Badge>]}
                    actions={
                        <IconButton
                            icon="fa-trash"
                            label={`Delete ${dataset.name}`}
                            variant="danger"
                            quiet
                        />
                    }
                />
            ))}
        </List>
    )
}

export function DatasetTable({ datasets }: { datasets: Dataset[] }) {
    return (
        <Table
            caption="Datasets"
            rows={datasets}
            rowKey={(dataset) => dataset.id}
            columns={[
                { key: 'name', label: 'Name', render: (dataset) => dataset.name },
                { key: 'files', label: 'Files', render: (dataset) => dataset.files },
                {
                    key: 'actions',
                    label: 'Actions',
                    actions: true,
                    render: (dataset) => (
                        <IconButton
                            icon="fa-pen"
                            label={`Edit ${dataset.name}`}
                            size="small"
                            tooltip
                        />
                    ),
                },
            ]}
        />
    )
}
```

A `Table` sorts when given `sort` (`{ key, direction }`) and `onSort`, and says the new order aloud; the sorting itself is yours.

### Tabs

```tsx
import { TabPanel, Tabs } from '@ds-wizard/plugin-sdk/ui/Tabs'
import { Body } from '@ds-wizard/plugin-sdk/ui/Text'
import { useState } from 'react'

export function Views() {
    const [tab, setTab] = useState('files')
    return (
        <>
            <Tabs
                id="views"
                label="Views"
                active={tab}
                onSelect={setTab}
                tabs={[
                    { id: 'files', label: 'Files', icon: 'fa-file' },
                    { id: 'history', label: 'History' },
                ]}
            />
            <TabPanel tabsId="views" label={tab}>
                <Body>{tab === 'files' ? 'The files.' : 'What happened to them.'}</Body>
            </TabPanel>
        </>
    )
}
```

### A File Importer

An importer that needs nothing but a file uses `SimpleFileImporter`: it draws the heading, the file field and the errors, reads and parses the file, and hands the events to the wizard. The plugin writes the parsing (`parse`, `JSON.parse` by default) and what replies the file makes (`importData`):

```tsx
import { ProjectImporterComponentProps } from '@ds-wizard/plugin-sdk/elements'
import { SimpleFileImporter } from '@ds-wizard/plugin-sdk/ui/SimpleFileImporter'

type Dmp = { dmp: { title: string } }

export default function DmpImporter({
    knowledgeModel,
    onImport,
}: ProjectImporterComponentProps<SettingsData, UserSettingsData>) {
    return (
        <SimpleFileImporter<Dmp>
            heading="Import from a DMP"
            label="DMP file"
            description="A maDMP in the RDA DMP Common Standard, as JSON."
            knowledgeModel={knowledgeModel}
            onImport={onImport}
            importData={(importer, dmp) => importer.setReply(titlePath, dmp.dmp.title)}
        />
    )
}
```

A file that cannot be read, parsed or imported is said under the field (`errorMessage`, or `formatError` for the reason), and another can be chosen.

### Your Own Styles

What the components do not cover can be styled with the design tokens, which follow the theme and the instance's colors as the components do:

```tsx
import { token } from '@ds-wizard/plugin-sdk/ui/tokens'

export function Highlight({ children }: { children: string }) {
    return (
        <div
            style={{
                padding: token('--ui-space-3'),
                borderRadius: token('--ui-radius-surface'),
                background: token('--ui-brand-subtle'),
                color: token('--ui-brand-on-subtle'),
            }}
        >
            {children}
        </div>
    )
}
```

## Compatibility

| SDK Version | Wizard Version | Plugin API Version |
| ----------- | -------------- | ------------------ |
| 0.12.0      | >=5.0          | 0.5                |
| 0.11.0      | >=4.35         | 0.4                |
| 0.10.0      | >=4.34         | 0.4                |
| 0.9.2       | >=4.29         | 0.3                |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for more details.
