import React from 'react'

import { ProjectImporterEvent } from '../data'
import { KnowledgeModelData, KnowledgeModelDataCodec } from '../data/knowledge-model-data'
import { ATTR, EVT } from '../protocol'
import { BaseElement } from './base-element'

export type ProjectImporterComponentProps<S, U> = {
    settings: S
    userSettings: U
    knowledgeModel: KnowledgeModelData | null
    onImport: (events: ProjectImporterEvent[]) => void
}

export type ProjectImporterComponent<S, U> = React.ComponentType<
    ProjectImporterComponentProps<S, U>
>

export abstract class ProjectImporterElement<S, U> extends BaseElement<S, U> {
    protected Component: ProjectImporterComponent<S, U> | null = null
    protected knowledgeModel: KnowledgeModelData | null = null

    abstract getReactComponent(): ProjectImporterComponent<S, U>

    static get observedAttributes(): string[] {
        return [...super.observedAttributes, ATTR.knowledgeModelValue]
    }

    protected onConnect(): void {
        super.onConnect()
        this.Component = this.getReactComponent()

        this.syncKnowledgeModelFromAttribute()
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

    protected render(): void {
        const root = this.root
        const Component = this.Component
        if (!root || !Component) return

        root.render(
            React.createElement(Component, {
                settings: this.settings,
                userSettings: this.userSettings,
                knowledgeModel: this.knowledgeModel,
                onImport: (events) => {
                    this.emit(EVT.import, { events })
                },
            }),
        )
    }
}
