import {
    KnowledgeModelIntegrationEditorComponent,
    KnowledgeModelIntegrationEditorElement,
    KnowledgeModelIntegrationQuestionnaireComponent,
    KnowledgeModelIntegrationQuestionnaireElement,
    ProjectQuestionActionComponent,
    ProjectQuestionActionElement,
} from '../elements'
import { DocumentActionComponent, DocumentActionElement } from '../elements/document-action-element'
import { ProjectActionComponent, ProjectActionElement } from '../elements/project-action-element'
import {
    ProjectImporterComponent,
    ProjectImporterElement,
} from '../elements/project-importer-element'
import { ProjectTabComponent, ProjectTabElement } from '../elements/project-tab-element'
import { SettingsComponent, SettingsElement } from '../elements/settings-element'
import { UserSettingsComponent, UserSettingsElement } from '../elements/user-settings-element'
import { JsonCodec } from '../utils/json'

export type DocumentActionElementClass<S, U> = new (
    ...args: unknown[]
) => DocumentActionElement<S, U>
export type KnowledgeModelIntegrationEditorElementClass<S, U, P> = new (
    ...args: unknown[]
) => KnowledgeModelIntegrationEditorElement<S, U, P>
export type KnowledgeModelIntegrationQuestionnaireElementClass<S, U, P> = new (
    ...args: unknown[]
) => KnowledgeModelIntegrationQuestionnaireElement<S, U, P>
export type ProjectImporterElementClass<S, U> = new (
    ...args: unknown[]
) => ProjectImporterElement<S, U>
export type ProjectActionElementClass<S, U> = new (...args: unknown[]) => ProjectActionElement<S, U>
export type ProjectQuestionActionElementClass<S, U> = new (
    ...args: unknown[]
) => ProjectQuestionActionElement<S, U>
export type ProjectTabElementClass<S, U> = new (...args: unknown[]) => ProjectTabElement<S, U>
export type SettingsElementClass<S> = new (...args: unknown[]) => SettingsElement<S>
export type UserSettingsElementClass<S, U> = new (...args: unknown[]) => UserSettingsElement<S, U>

export class ElementFactory<S, U> {
    protected settingsDataCodec: JsonCodec<S>
    protected userSettingsDataCodec: JsonCodec<U>

    constructor(settingsDataCodec: JsonCodec<S>, userSettingsDataCodec: JsonCodec<U>) {
        this.settingsDataCodec = settingsDataCodec
        this.userSettingsDataCodec = userSettingsDataCodec
    }

    createDocumentActionElement(
        documentActionComponent: DocumentActionComponent<S, U>,
    ): DocumentActionElementClass<S, U> {
        const settingsDataCodec = this.settingsDataCodec
        const userSettingsDataCodec = this.userSettingsDataCodec

        return class extends DocumentActionElement<S, U> {
            getSettingsDataCodec(): JsonCodec<S> {
                return settingsDataCodec
            }

            getUserSettingsDataCodec(): JsonCodec<U> {
                return userSettingsDataCodec
            }

            getReactComponent(): DocumentActionComponent<S, U> {
                return documentActionComponent
            }
        }
    }

    createKnowledgeModelIntegrationEditorElement<P>(
        knowledgeModelIntegrationEditorComponent: KnowledgeModelIntegrationEditorComponent<S, U, P>,
        pluginIntegrationSettingsDataCodec: JsonCodec<P>,
    ): KnowledgeModelIntegrationEditorElementClass<S, U, P> {
        const settingsDataCodec = this.settingsDataCodec
        const userSettingsDataCodec = this.userSettingsDataCodec

        return class extends KnowledgeModelIntegrationEditorElement<S, U, P> {
            getSettingsDataCodec(): JsonCodec<S> {
                return settingsDataCodec
            }

            getUserSettingsDataCodec(): JsonCodec<U> {
                return userSettingsDataCodec
            }

            getPluginIntegrationSettingsDataCodec(): JsonCodec<P> {
                return pluginIntegrationSettingsDataCodec
            }

            getReactComponent(): KnowledgeModelIntegrationEditorComponent<S, U, P> {
                return knowledgeModelIntegrationEditorComponent
            }
        }
    }

    createKnowledgeModelIntegrationQuestionnaireElement<P>(
        knowledgeModelIntegrationQuestionnaireComponent: KnowledgeModelIntegrationQuestionnaireComponent<
            S,
            U,
            P
        >,
        pluginIntegrationSettingsDataCodec: JsonCodec<P>,
    ): KnowledgeModelIntegrationQuestionnaireElementClass<S, U, P> {
        const settingsDataCodec = this.settingsDataCodec
        const userSettingsDataCodec = this.userSettingsDataCodec

        return class extends KnowledgeModelIntegrationQuestionnaireElement<S, U, P> {
            getSettingsDataCodec(): JsonCodec<S> {
                return settingsDataCodec
            }

            getUserSettingsDataCodec(): JsonCodec<U> {
                return userSettingsDataCodec
            }

            getPluginIntegrationSettingsDataCodec(): JsonCodec<P> {
                return pluginIntegrationSettingsDataCodec
            }

            getReactComponent(): KnowledgeModelIntegrationQuestionnaireComponent<S, U, P> {
                return knowledgeModelIntegrationQuestionnaireComponent
            }
        }
    }

    createProjectImporterElement(
        projectImporterComponent: ProjectImporterComponent<S, U>,
    ): ProjectImporterElementClass<S, U> {
        const settingsDataCodec = this.settingsDataCodec
        const userSettingsDataCodec = this.userSettingsDataCodec

        return class extends ProjectImporterElement<S, U> {
            getSettingsDataCodec(): JsonCodec<S> {
                return settingsDataCodec
            }

            getUserSettingsDataCodec(): JsonCodec<U> {
                return userSettingsDataCodec
            }

            getReactComponent(): ProjectImporterComponent<S, U> {
                return projectImporterComponent
            }
        }
    }

    createProjectActionElement(
        projectActionComponent: ProjectActionComponent<S, U>,
    ): ProjectActionElementClass<S, U> {
        const settingsDataCodec = this.settingsDataCodec
        const userSettingsDataCodec = this.userSettingsDataCodec

        return class extends ProjectActionElement<S, U> {
            getSettingsDataCodec(): JsonCodec<S> {
                return settingsDataCodec
            }

            getUserSettingsDataCodec(): JsonCodec<U> {
                return userSettingsDataCodec
            }

            getReactComponent(): ProjectActionComponent<S, U> {
                return projectActionComponent
            }
        }
    }

    createProjectQuestionActionElement(
        projectQuestionActionComponent: ProjectQuestionActionComponent<S, U>,
    ): ProjectQuestionActionElementClass<S, U> {
        const settingsDataCodec = this.settingsDataCodec
        const userSettingsDataCodec = this.userSettingsDataCodec

        return class extends ProjectQuestionActionElement<S, U> {
            getSettingsDataCodec(): JsonCodec<S> {
                return settingsDataCodec
            }

            getUserSettingsDataCodec(): JsonCodec<U> {
                return userSettingsDataCodec
            }

            getReactComponent(): ProjectQuestionActionComponent<S, U> {
                return projectQuestionActionComponent
            }
        }
    }

    createProjectTabElement(
        projectTabComponent: ProjectTabComponent<S, U>,
    ): ProjectTabElementClass<S, U> {
        const settingsDataCodec = this.settingsDataCodec
        const userSettingsDataCodec = this.userSettingsDataCodec

        return class extends ProjectTabElement<S, U> {
            getSettingsDataCodec(): JsonCodec<S> {
                return settingsDataCodec
            }

            getUserSettingsDataCodec(): JsonCodec<U> {
                return userSettingsDataCodec
            }

            getReactComponent(): ProjectTabComponent<S, U> {
                return projectTabComponent
            }
        }
    }

    createSettingsElement(settingsComponent: SettingsComponent<S>): SettingsElementClass<S> {
        const settingsDataCodec = this.settingsDataCodec

        return class extends SettingsElement<S> {
            getSettingsDataCodec(): JsonCodec<S> {
                return settingsDataCodec
            }

            getReactComponent(): SettingsComponent<S> {
                return settingsComponent
            }
        }
    }

    createUserSettingsElement(
        userSettingsComponent: UserSettingsComponent<S, U>,
    ): UserSettingsElementClass<S, U> {
        const settingsDataCodec = this.settingsDataCodec
        const userSettingsDataCodec = this.userSettingsDataCodec

        return class extends UserSettingsElement<S, U> {
            getSettingsDataCodec(): JsonCodec<S> {
                return settingsDataCodec
            }

            getUserSettingsDataCodec(): JsonCodec<U> {
                return userSettingsDataCodec
            }

            getReactComponent(): UserSettingsComponent<S, U> {
                return userSettingsComponent
            }
        }
    }
}
