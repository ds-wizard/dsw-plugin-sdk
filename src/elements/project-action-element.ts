import React from 'react'

import { ProjectData, ProjectDataCodec } from '../data/project-data'
import { ATTR, EVT } from '../protocol'
import { BaseElement } from './base-element'

export type ProjectActionComponentProps<S, U> = {
    settings: S
    userSettings: U
    project: ProjectData | null
    onActionClose: () => void
}

export type ProjectActionComponent<S, U> = React.ComponentType<ProjectActionComponentProps<S, U>>

export abstract class ProjectActionElement<S, U> extends BaseElement<S, U> {
    protected Component: ProjectActionComponent<S, U> | null = null
    protected project: ProjectData | null = null

    abstract getReactComponent(): ProjectActionComponent<S, U>

    static get observedAttributes(): string[] {
        return [...super.observedAttributes, ATTR.projectValue]
    }

    protected onConnect(): void {
        super.onConnect()
        this.Component = this.getReactComponent()

        this.syncProjectFromAttribute()
    }

    protected syncProjectFromAttribute(): void {
        const raw = this.getAttribute(ATTR.projectValue)
        if (!raw || !raw.trim()) return

        const decoded = this.decodeDocument(raw)
        if (decoded !== null) this.project = decoded
    }

    protected decodeDocument(raw: string): ProjectData | null {
        const result = ProjectDataCodec.decode(raw)
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
                project: this.project,
                onActionClose: () => {
                    this.emitEmpty(EVT.actionClose)
                },
            }),
        )
    }
}
