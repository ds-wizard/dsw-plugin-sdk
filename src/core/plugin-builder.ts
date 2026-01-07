import { DocumentActionComponent } from '../elements/document-action-element'
import { ProjectActionComponent } from '../elements/project-action-element'
import { SettingsComponent } from '../elements/settings-element'
import { UserSettingsComponent } from '../elements/user-settings-element'
import {
    ActionConnector,
    ActionWithIconConnector,
    Connectors,
    Plugin,
    PluginMetadata,
    SimpleElementConnector,
} from '../types'
import { JsonCodec, makeNullCodec } from '../utils/json'
import { ElementFactory } from './element-factory'
import { PluginApiVersion } from '../version'

export class PluginBuilder<S, U> {
    protected metadata: PluginMetadata
    protected elementFactory: ElementFactory<S, U>

    protected documentActions?: ActionWithIconConnector[]
    protected projectActions?: ActionConnector[]
    protected settings?: SimpleElementConnector
    protected userSettings?: SimpleElementConnector

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
    ): PluginBuilder<S, U> {
        if (!this.documentActions) {
            this.documentActions = []
        }
        this.documentActions.push({
            action: { icon, name },
            element,
        })

        const documentActionElement = this.elementFactory.createDocumentActionElement(component)
        customElements.define(element, documentActionElement)

        return this
    }

    addProjectAction(
        name: string,
        element: string,
        component: ProjectActionComponent<S, U>,
    ): PluginBuilder<S, U> {
        if (!this.projectActions) {
            this.projectActions = []
        }
        this.projectActions.push({
            name,
            element,
        })

        const projectActionElement = this.elementFactory.createProjectActionElement(component)
        customElements.define(element, projectActionElement)

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
        if (this.settings) connectors.settings = this.settings
        if (this.userSettings) connectors.userSettings = this.userSettings

        return connectors
    }
}
