export const ATTR = {
    documentValue: 'document-value',
    integrationReply: 'integration-reply-value',
    knowledgeModelValue: 'knowledge-model-value',
    pluginIntegrationSettings: 'plugin-integration-settings-value',
    projectValue: 'project-value',
    questionPathValue: 'question-path-value',
    questionValue: 'question-value',
    settingsValue: 'settings-value',
    userSettingsValue: 'user-settings-value',
} as const

export const EVT = {
    actionClose: 'action-close',
    import: 'import',
    pluginIntegrationSettingsChange: 'plugin-integration-settings-change',
    replyValueChange: 'reply-value-change',
    settingsValueChange: 'settings-value-change',
    userSettingsValueChange: 'user-settings-value-change',
} as const

// nice helper types
export type AttrName = (typeof ATTR)[keyof typeof ATTR]
export type EventName = (typeof EVT)[keyof typeof EVT]
