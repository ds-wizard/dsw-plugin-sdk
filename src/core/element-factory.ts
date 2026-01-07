import { SettingsComponent, SettingsElement } from '../elements/settings-element'
import { JsonCodec } from '../utils/json'
import { UserSettingsComponent, UserSettingsElement } from '../elements/user-settings-element'
import { DocumentActionComponent, DocumentActionElement } from '../elements/document-action-element'
import { ProjectActionComponent, ProjectActionElement } from '../elements/project-action-element'

export type DocumentActionElementClass<S, U> = new (...args: any[]) => DocumentActionElement<S, U>
export type ProjectActionElementClass<S, U> = new (...args: any[]) => ProjectActionElement<S, U>
export type SettingsElementClass<S> = new (...args: any[]) => SettingsElement<S>
export type UserSettingsElementClass<S, U> = new (...args: any[]) => UserSettingsElement<S, U>

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
