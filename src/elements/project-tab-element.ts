import React from 'react'

import { ProjectData, ProjectDataCodec } from '../data/project-common-data'
import { ATTR } from '../protocol'
import { BaseElement } from './base-element'

export type ProjectTabComponentProps<S, U> = {
    settings: S
    userSettings: U
    project: ProjectData | null
}

export type ProjectTabComponent<S, U> = React.ComponentType<ProjectTabComponentProps<S, U>>

export abstract class ProjectTabElement<S, U> extends BaseElement<S, U> {
    protected Component: ProjectTabComponent<S, U> | null = null
    protected project: ProjectData | null = null

    abstract getReactComponent(): ProjectTabComponent<S, U>

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

        const decoded = this.decodeProject(raw)
        if (decoded !== null) this.project = decoded
    }

    protected decodeProject(raw: string): ProjectData | null {
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
            }),
        )
    }
}
