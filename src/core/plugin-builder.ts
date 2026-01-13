import { ProjectQuestionActionComponent } from '../elements'
import { DocumentActionComponent } from '../elements/document-action-element'
import { ProjectActionComponent } from '../elements/project-action-element'
import { ProjectImporterComponent } from '../elements/project-importer-element'
import { ProjectTabComponent } from '../elements/project-tab-element'
import { SettingsComponent } from '../elements/settings-element'
import { UserSettingsComponent } from '../elements/user-settings-element'
import {
    Connectors,
    DocumentActionConnector,
    Plugin,
    PluginMetadata,
    ProjectActionConnector,
    ProjectImporterConnector,
    ProjectQuestionActionConnector,
    ProjectQuestionActionConnectorType,
    ProjectTabConnector,
    SettingsConnector,
} from '../types'
import { JsonCodec, makeNullCodec } from '../utils/json'
import { PluginApiVersion } from '../version'
import { ElementFactory } from './element-factory'

export class PluginBuilder<S, U> {
    protected metadata: PluginMetadata
    protected elementFactory: ElementFactory<S, U>

    protected documentActions?: DocumentActionConnector[]
    protected projectActions?: ProjectActionConnector[]
    protected projectImporters?: ProjectImporterConnector[]
    protected projectQuestionActions?: ProjectQuestionActionConnector[]
    protected projectTabs?: ProjectTabConnector[]
    protected settings?: SettingsConnector
    protected userSettings?: SettingsConnector

    static create<S, U>(
        metadata: PluginMetadata,
        settingsDataCodec: JsonCodec<S>,
        userSettingsDataCodec: JsonCodec<U>,
    ): PluginBuilder<S, U> {
        return new PluginBuilder(metadata, settingsDataCodec, userSettingsDataCodec)
    }

    static createWithNoSettings(metadata: PluginMetadata): PluginBuilder<null, null> {
        return new PluginBuilder<null, null>(metadata, makeNullCodec(), makeNullCodec())
    }

    private constructor(
        metadata: PluginMetadata,
        settingsDataCodec: JsonCodec<S>,
        userSettingsDataCodec: JsonCodec<U>,
    ) {
        this.metadata = metadata
        this.elementFactory = new ElementFactory(settingsDataCodec, userSettingsDataCodec)
    }

    addDocumentAction(
        icon: string,
        name: string,
        element: string,
        component: DocumentActionComponent<S, U>,
        dtPatterns: string[] | null = null,
        dtFormats: string[] | null = null,
    ): PluginBuilder<S, U> {
        if (!this.documentActions) {
            this.documentActions = []
        }

        this.documentActions.push({
            action: { icon, name },
            element,
            dtPatterns,
            dtFormats,
        })

        const documentActionElement = this.elementFactory.createDocumentActionElement(component)
        customElements.define(element, documentActionElement)

        return this
    }

    addProjectAction(
        name: string,
        element: string,
        component: ProjectActionComponent<S, U>,
        kmPatterns: string[] | null = null,
    ): PluginBuilder<S, U> {
        if (!this.projectActions) {
            this.projectActions = []
        }

        this.projectActions.push({
            name,
            element,
            kmPatterns,
        })

        const projectActionElement = this.elementFactory.createProjectActionElement(component)
        customElements.define(element, projectActionElement)

        return this
    }

    addProjectImporter(
        name: string,
        url: string,
        element: string,
        component: ProjectImporterComponent<S, U>,
        kmPatterns: string[] | null = null,
    ): PluginBuilder<S, U> {
        if (!this.projectImporters) {
            this.projectImporters = []
        }

        this.projectImporters.push({
            name,
            url,
            element,
            kmPatterns,
        })

        const importerElement = this.elementFactory.createProjectImporterElement(component)
        customElements.define(element, importerElement)

        return this
    }

    addProjectQuestionAction(
        icon: string,
        name: string,
        type: ProjectQuestionActionConnectorType,
        element: string,
        component: ProjectQuestionActionComponent<S, U>,
        kmPatterns: string[] | null = null,
    ): PluginBuilder<S, U> {
        if (!this.projectQuestionActions) {
            this.projectQuestionActions = []
        }

        this.projectQuestionActions.push({
            action: { icon, name },
            type,
            element,
            kmPatterns,
        })

        const projectQuestionActionElement =
            this.elementFactory.createProjectQuestionActionElement(component)
        customElements.define(element, projectQuestionActionElement)

        return this
    }

    addProjectTab(
        icon: string,
        name: string,
        url: string,
        element: string,
        component: ProjectTabComponent<S, U>,
        kmPatterns: string[] | null = null,
    ): PluginBuilder<S, U> {
        if (!this.projectTabs) {
            this.projectTabs = []
        }

        this.projectTabs.push({
            tab: { icon, name },
            url,
            element,
            kmPatterns,
        })

        const projectTabElement = this.elementFactory.createProjectTabElement(component)
        customElements.define(element, projectTabElement)

        return this
    }

    addSettings(element: string, component: SettingsComponent<S>): PluginBuilder<S, U> {
        this.settings = { element }

        const settingsElement = this.elementFactory.createSettingsElement(component)
        customElements.define(element, settingsElement)

        return this
    }

    addUserSettings(element: string, component: UserSettingsComponent<S, U>): PluginBuilder<S, U> {
        this.userSettings = { element }

        const userSettingsElement = this.elementFactory.createUserSettingsElement(component)
        customElements.define(element, userSettingsElement)

        return this
    }

    createPlugin(): Plugin {
        return {
            uuid: this.metadata.uuid,
            name: this.metadata.name,
            version: this.metadata.version,
            description: this.metadata.description,
            pluginApiVersion: PluginApiVersion,
            connectors: this.createConnectors(),
        }
    }

    protected createConnectors(): Connectors {
        let connectors: Connectors = {}

        if (this.documentActions) connectors.documentActions = this.documentActions
        if (this.projectActions) connectors.projectActions = this.projectActions
        if (this.projectImporters) connectors.projectImporters = this.projectImporters
        if (this.projectQuestionActions)
            connectors.projectQuestionActions = this.projectQuestionActions
        if (this.projectTabs) connectors.projectTabs = this.projectTabs
        if (this.settings) connectors.settings = this.settings
        if (this.userSettings) connectors.userSettings = this.userSettings

        return connectors
    }
}
