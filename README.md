# DSW Plugin SDK

_SDK for creating plugins for DS Wizard._

## Get Started

Get started by choosing one of the plugin templates and following the instructions there:

- [DSW Plugin Template](https://github.com/ds-wizard/dsw-plugin-template) for simple plugins.
- [DSW Plugin Service Template](https://github.com/ds-wizard/dsw-plugin-service-template) for plugins that require custom backend in [Engine Gateway](https://github.com/ds-wizard/engine-gateway).

## How It Works

The plugin is defined by its metadata and its connectors to various parts of the wizard. Then, after installation, it is loaded by the wizard and displayed where defined to provide additional functionality.

### Plugin Definition

The first part of the plugin definition is the metadata. This is prepared in the `metadata.ts` file in the templates. Fill in the details about your plugin there. You can use [UUID Generator](https://www.uuidgenerator.net) to generate a unique UUID for the plugin.

```ts
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

#### Plugin Builder

The plugin is created using the so-called `PluginBuilder`. There are two options, based on whether we want to use the aforementioned settings or not:

```ts
const plugin = PluginBuilder.create(pluginMetadata, SettingsDataCodec, UserSettingsDataCode)
    // Add connectors here
    .createPlugin()

const plugin = PluginBuilder.createWithNoSettings(pluginMetadata)
    // Add connectors here
    .createPlugin()
```

Then, the connectors will be chained to this using the `PluginBuilder` as well.

#### Settings and User Settings Definition

The types for settings are defined using [zod](https://zod.dev) library as they need to be parsed first. There are prepared files for that in the templates in the _data_ directory.

If you only need to use one type of settings, you can use the `makeNullCodec` helper for the other, so you don't have to define it.

```ts
const plugin = PluginBuilder.create(pluginMetadata, SettingsDataCodec, makeNullCodec())
    // Add connectors here
    .createPlugin()
```

### Connectors

Connectors are used to connect the plugin to pre-defined places in the wizard application. They usually consist of a button definition and a component that is then rendered, providing the plugin's functionality.

Each component must have the expected type annotation to be compliant with the connector. It renders a React component that facilitates the intended functionality.

The React component is then rendered within a custom web component. You need to give this web component a name within the connector definition. Try to make this **universally unique** to avoid clashes with other plugins. For example, include plugin name, such as `x-plugin-name-component-name`. Also, use kebab case for the naming.

One plugin can provide multiple connectors of the same type. Each web component for each action must have a unique name.

#### Document Action

The Document Action connector adds an action with an icon to the documents' context menu. The action will open a modal window that renders the plugin component. Optionally, the document action can be limited to only a selection of document templates or document formats.

```ts
const plugin = PluginBuilder.create(...)
        .addDocumentAction(
            'fas fa-envelopes-bulk', // font awesome icon
            'Action Name',
            'x-plugin-name-document-action', // web component name
            DocumentActionComponent, // React component with plugin functionality
            ['dsw:questionnaire-report:>=2.16.0'], // (optional) list of supported document templates
            ['a9293d08-59a4-4e6b-ae62-7a6a570b031c'], // (optional) list of supported format UUIDs
        )
```

The React component has the following input:

- `settings` - custom plugin global settings
- `userSettings` - custom plugin user settings
- `document` - document data as defined in [document-data.ts](src/data/document-data.ts)
- `onActionClose` - call to close the action modal

```ts
import { DocumentActionComponentProps } from '@ds-wizard/plugin-sdk/elements'

export default function DocumentAction({
    settings,
    userSettings,
    document,
    onActionClose,
}: DocumentActionComponentProps<SettingsData, UserSettingsData>) {
    return <div>Document Action</div>
}
```

#### Project Action

The Project Action connector adds an action to the project action list on the project detail page. The action will open a modal window that renders the plugin component. Optionally, the project action can be limited to only a selection of knowledge models.

```ts
const plugin = PluginBuilder.create(...)
        .addProjectAction(
            'Action Name',
            'x-plugin-name-project-action', // web component name
            ProjectAction, // React component with plugin functionality
            ['dsw:root:^2'] // (optional) list of supported knowledge models
        )
```

The React component has the following input:

- `settings` - custom plugin global settings
- `userSettings` - custom plugin user settings
- `project` - project data as defined in [project-common-data.ts](src/data/project-common-data.ts)
- `onActionClose` - call to close the action modal

```ts
export default function ProjectAction({
    settings,
    userSettings,
    project,
    onActionClose,
}: ProjectActionComponentProps<SettingsData, UserSettingsData>) {
    return <div>Project Action</div>
}
```

#### Project Importer

The Project Importer connector is used to implement a project importer that can import replies from various sources into the project's questionnaire. It defines the importer's name and the component that handles the import. Optionally, it can be limited to only a selection of knowledge models.

Project Importer also defines its URL, which will be used as the last part of the project URL if the importer is open. Try to make this plugin-specific to avoid clashes with other plugins.

```ts
const plugin = PluginBuilder.create(...)
    .addProjectImporter(
        'Importer Name',
        'importer-url', // importer URL
        'x-plugin-name-project-importer', // web component name
        ProjectImporterComponent, // React component with plugin functionality
    )
```

The React component has the following input:

- `settings` - custom plugin global settings
- `userSettings` - custom plugin user settings
- `knowledgeModel` - current project's knowledge model data as defined in [knowledge-model-data.ts](src/data/knowledge-model-data.ts)
- `onImport` - call this with events generated by `ProjectImporter` to continue the import in the wizard


```ts
import { ProjectImporter } from '@ds-wizard/plugin-sdk/project-importer'

export default function ProjectImporterComponent({
    settings,
    userSettings,
    knowledgeModel,
    onImport,
}: ProjectImporterComponentProps<SettingsData, UserSettingsData>) {
    return <div>Project Importer</div>
}
```

##### Importer

To generate the events to be sent back to the wizard, use `ProjectImporter`.

```ts
import { ProjectImporter } from '@ds-wizard/plugin-sdk/project-importer'

const importer = new ProjectImporter()

// Question path is a list of UUID strings
const questionPath = [ /* ... */ ]

// Set a reply using the question path and a value
// The value is either a string for a value question or answer/choice 
// UUID for options/multichoice question
importer.setReply(questionPath, 'value')

// For a list question, add an item and then use the item's UUID
// to build the path for questions in the item
const itemUuid = importer.addItem(questionPath)
importer.setReply(
    [...questionPath, itemUuid, itemQuestionUuid],
    'Lee Harris'
)

// For an integration question, either use setReply to have a plain
// answer or use setIntegrationReply to set the link as well, so that
// the response will behave as if it were from the integration
importer.setIntegrationReply(
    questionPath,
    'Czech Technical University in Prague',
    { name: 'Czech Technical University in Prague', url: 'https://ror.org/03kqpb082' },
)


// Get events to be sent back to the wizard to handle the import
const events = importer.getEvents()
```



#### Project Question Action

The Project Question Action connector adds a button with an icon and a tooltip to each question that can open a modal or a sidebar containing the plugin component. Optionally, the project question action can be limited to only a selection of knowledge models.

```ts
const plugin = PluginBuilder.create(...)
        .addProjectQuestionAction(
            'far fa-window-restore', // font-awesome icon
            'Open modal', // tooltip label
            'modal', // where to open the component 'modal' | 'sidebar'
            'x-plugin-name-project-question-action', // web component name
            ProjectQuestionActionModal, // React component with plugin functionality
            ['dsw:root:^2'], // (optional) list of supported knowledge models
        )
```

The React component has the following input:

- `settings` - custom plugin global settings
- `userSettings` - custom plugin user settings
- `project` - project data as defined in [project-common-data.ts](src/data/project-common-data.ts)
- `question` - question data as defined in [question-data.ts](src/data/question-data.ts)
- `questionPath` - path to the question from which the action was opened
- `onActionClose` - call to close the action modal

```ts
import { ProjectQuestionActionComponentProps } from '@ds-wizard/plugin-sdk/elements'

export default function ProjectQuestionActionModal({
    settings,
    userSettings,
    project,
    question,
    questionPath,
    onActionClose,
}: ProjectQuestionActionComponentProps<SettingsData, UserSettingsData>) {
    return <div>Project Question Action</div>
}
```

#### Project Tab

The Project Tab connector adds a new tab to the project detail. Optionally, the project tab can be limited to only a selection of knowledge models.

The project tab also defines its URL, which will be used as the last part of the project URL if the tab is open. Try to make this specific to the plugin to avoid clashes with other plugins.

```ts
const plugin = PluginBuilder.create(...)
        .addProjectTab(
            'fas fa-home', // font-awesome tab icon
            'Home', // tab name
            'tab-url', // tab URL
            'x-plugin-name-project-tab', // web component name
            ProjectTab, // React component with plugin functionality
            ['dsw:root:^2'] // (optional) list of supported knowledge models
        )
```

The React component has the following input:

- `settings` - custom plugin global settings
- `userSettings` - custom plugin user settings
- `project` - project data as defined in [project-common-data.ts](src/data/project-common-data.ts)

```ts
import { ProjectTabComponentProps } from '@ds-wizard/plugin-sdk/elements'

export default function ProjectTab({
    settings,
    userSettings,
    project,
}: ProjectTabComponentProps<SettingsData, UserSettingsData>) {
    return <div>Project Tab</div>
}
```

#### Settings

The settings connector defines how the plugin's settings are set. It consists only of the component available from the general application settings. Unlike other connectors, a plugin can only have at most one Settings connector.

```ts
const plugin = PluginBuilder.create(...)
        .addSettings(
            'x-plugin-name-settings', // web component name
            Settings // React component with plugin functionality
        )
```

The React component has the following input:

- `settings` - custom plugin global settings
- `onSettingsChange` - call when settings data changes

```ts
import { SettingsComponentProps } from '@ds-wizard/plugin-sdk/elements'

export default function Settings({
    settings,
    onSettingsChange,
}: SettingsComponentProps<SettingsData>) {
    return <div>Settings</div>
}
```

#### User Settings

The User Settings connector defines how user-specific plugin settings are set. It consists only of the component available from the user settings. Unlike other connectors, a plugin can only have at most one User Settings connector.

```ts
const plugin = PluginBuilder.create(...)
        .addSettings(
            'x-plugin-name-user-settings', // web component name
            UserSettings  // React component with plugin functionality
        )
```

The React component has the following input:

- `settings` - custom plugin global settings
- `userSettings` - custom plugin user settings
- `onUserSettingsChange` - call when user settings data changes

```ts
import { UserSettingsComponentProps } from '@ds-wizard/plugin-sdk/elements'

export default function UserSettings({
    settings,
    userSettings,
    onUserSettingsChange,
}: UserSettingsComponentProps<UserSettingsData, UserSettingsData>) {
    return <div>User Settings</div>
}
```

### UI Components

There are UI components prepared to simplify the development of common use cases.

- [Modal Content](src/ui/ModalContent.tsx) - for all connectors that render into a modal that don't need anything special
- [Simple File Importer](src/ui/SimpleFileImporter.tsx) - for importers that only need a file and handle the import based on that

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for more details.
