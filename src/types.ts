export type PluginMetadata = {
    uuid: string
    name: string
    version: string
    description: string
}

export type Plugin = {
    uuid: string
    name: string
    version: string
    description: string
    pluginApiVersion: string
    connectors: Connectors
}

export type PluginManifest = {
    uuid: string
    name: string
    version: string
    description: string
    pluginApiVersion: string
}

export type Connectors = {
    documentActions?: DocumentActionConnector[]
    projectActions?: ProjectActionConnector[]
    projectQuestionActions?: ProjectQuestionActionConnector[]
    projectTabs?: ProjectTabConnector[]
    settings?: SettingsConnector
    userSettings?: SettingsConnector
}

export type ActionWithIcon = {
    icon: string
    name: string
}

export type DocumentActionConnector = {
    action: ActionWithIcon
    element: string
    dtPatterns: string[] | null
    dtFormats: string[] | null
}

export type ProjectActionConnector = {
    name: string
    element: string
    kmPatterns: string[] | null
}

export type ProjectQuestionActionConnector = {
    action: ActionWithIcon
    type: ProjectQuestionActionConnectorType
    element: string
    kmPatterns: string[] | null
}

export type ProjectQuestionActionConnectorType = 'modal' | 'sidebar'

export type ProjectTabConnector = {
    tab: ActionWithIcon
    url: string
    element: string
    kmPatterns: string[] | null
}

export type SettingsConnector = {
    element: string
}
