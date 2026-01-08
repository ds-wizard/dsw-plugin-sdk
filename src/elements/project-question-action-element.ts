import React from 'react'
import { QuestionData, QuestionDataCodec } from 'src/data/question-data'

import { ProjectData, ProjectDataCodec } from '../data/project-common-data'
import { ATTR, EVT } from '../protocol'
import { BaseElement } from './base-element'

export type ProjectQuestionActionComponentProps<S, U> = {
    settings: S
    userSettings: U
    project: ProjectData | null
    question: QuestionData | null
    questionPath: string | null
    onActionClose: () => void
}

export type ProjectQuestionActionComponent<S, U> = React.ComponentType<
    ProjectQuestionActionComponentProps<S, U>
>

export abstract class ProjectQuestionActionElement<S, U> extends BaseElement<S, U> {
    protected Component: ProjectQuestionActionComponent<S, U> | null = null
    protected project: ProjectData | null = null
    protected question: QuestionData | null = null
    protected questionPath: string | null = null

    abstract getReactComponent(): ProjectQuestionActionComponent<S, U>

    static get observedAttributes(): string[] {
        return [
            ...super.observedAttributes,
            ATTR.projectValue,
            ATTR.questionPathValue,
            ATTR.questionValue,
        ]
    }

    protected onConnect(): void {
        super.onConnect()
        this.Component = this.getReactComponent()

        this.syncProjectFromAttribute()
        this.syncQuestionFromAttribute()
        this.syncQuestionPathFromAttribute()
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

    protected syncQuestionFromAttribute(): void {
        const raw = this.getAttribute(ATTR.questionValue)
        if (!raw || !raw.trim()) return

        const decoded = this.decodeQuestion(raw)
        if (decoded !== null) this.question = decoded
    }

    protected syncQuestionPathFromAttribute(): void {
        const raw = this.getAttribute(ATTR.questionPathValue)
        if (!raw || !raw.trim()) return

        const questionPath = JSON.parse(raw) as string
        this.questionPath = questionPath
    }

    protected decodeQuestion(raw: string): QuestionData | null {
        const result = QuestionDataCodec.decode(raw)
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
                question: this.question,
                questionPath: this.questionPath,
                onActionClose: () => {
                    this.emitEmpty(EVT.actionClose)
                },
            }),
        )
    }
}
