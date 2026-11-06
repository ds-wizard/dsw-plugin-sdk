import React from 'react'

import { ProjectImporterEvent } from '../data'
import { KnowledgeModelData, KnowledgeModelDataCodec } from '../data/knowledge-model-data'
import { ProjectData, ProjectDataCodec } from '../data/project-common-data'
import { UserData } from '../data/user-data'
import { ATTR, EVT } from '../protocol'
import { BaseElement } from './base-element'

export type ProjectImporterComponentProps<S, U> = {
    settings: S
    userSettings: U
    user: UserData | null
    knowledgeModel: KnowledgeModelData | null
    project: ProjectData | null
    onImport: (events: ProjectImporterEvent[]) => void
}

export type ProjectImporterComponent<S, U> = React.ComponentType<
    ProjectImporterComponentProps<S, U>
>

export abstract class ProjectImporterElement<S, U> extends BaseElement<S, U> {
    protected Component: ProjectImporterComponent<S, U> | null = null
    protected knowledgeModel: KnowledgeModelData | null = null
    protected project: ProjectData | null = null

    abstract getReactComponent(): ProjectImporterComponent<S, U>

    static get observedAttributes(): string[] {
        return [...super.observedAttributes, ATTR.knowledgeModelValue, ATTR.projectValue]
    }

    protected onConnect(): void {
        super.onConnect()
        this.Component = this.getReactComponent()

        this.syncKnowledgeModelFromAttribute()
        this.syncProjectFromAttribute()
    }

    protected onAttributeChanged(name: string): void {
        super.onAttributeChanged(name)

        if (name === ATTR.knowledgeModelValue) this.syncKnowledgeModelFromAttribute()
        if (name === ATTR.projectValue) this.syncProjectFromAttribute()
    }

    protected syncKnowledgeModelFromAttribute(): void {
        const raw = this.getAttribute(ATTR.knowledgeModelValue)
        if (!raw || !raw.trim()) return

        const decoded = this.decodeKnowledgeModel(raw)
        if (decoded !== null) this.knowledgeModel = decoded
    }

    protected decodeKnowledgeModel(raw: string): KnowledgeModelData | null {
        const result = KnowledgeModelDataCodec.decode(raw)
        return result.ok ? result.value : null
    }

    protected syncProjectFromAttribute(): void {
        const raw = this.getAttribute(ATTR.projectValue)
        if (!raw || !raw.trim()) return

        const result = ProjectDataCodec.decode(raw)
        if (result.ok) this.project = result.value
    }

    protected render(): void {
        const root = this.root
        const Component = this.Component
        if (!root || !Component) return

        root.render(
            React.createElement(Component, {
                settings: this.settings,
                userSettings: this.userSettings,
                user: this.user,
                knowledgeModel: this.knowledgeModel,
                project: this.project,
                onImport: (events) => {
                    this.emit(EVT.import, { events })
                },
            }),
        )
    }
}
