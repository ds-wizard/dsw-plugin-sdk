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
    documentActions?: ActionWithIconConnector[]
    projectActions?: ActionConnector[]
    settings?: SimpleElementConnector
    userSettings?: SimpleElementConnector
}

export type SimpleElementConnector = {
    element: string
}

export type ActionConnector = {
    name: string
    element: string
}

export type ActionWithIconConnector = {
    action: ActionWithIcon
    element: string
}

export type ActionWithIcon = {
    icon: string
    name: string
}
