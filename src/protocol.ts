export const ATTR = {
    documentValue: 'document-value',
    knowledgeModelValue: 'knowledge-model-value',
    projectValue: 'project-value',
    questionPathValue: 'question-path-value',
    questionValue: 'question-value',
    settingsValue: 'settings-value',
    userSettingsValue: 'user-settings-value',
} as const

export const EVT = {
    actionClose: 'action-close',
    import: 'import',
    settingsValueChange: 'settings-value-change',
    userSettingsValueChange: 'user-settings-value-change',
} as const

// nice helper types
export type AttrName = (typeof ATTR)[keyof typeof ATTR]
export type EventName = (typeof EVT)[keyof typeof EVT]
