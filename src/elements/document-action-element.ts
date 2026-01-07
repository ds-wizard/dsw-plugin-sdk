import React from 'react'

import { DocumentData, DocumentDataCodec } from '../data/document-data'
import { ATTR, EVT } from '../protocol'
import { BaseElement } from './base-element'

export type DocumentActionComponentProps<S, U> = {
    settings: S
    userSettings: U
    document: DocumentData | null
    onActionClose: () => void
}

export type DocumentActionComponent<S, U> = React.ComponentType<DocumentActionComponentProps<S, U>>

export abstract class DocumentActionElement<S, U> extends BaseElement<S, U> {
    protected Component: DocumentActionComponent<S, U> | null = null
    protected document: DocumentData | null = null

    abstract getReactComponent(): DocumentActionComponent<S, U>

    static get observedAttributes(): string[] {
        return [...super.observedAttributes, ATTR.documentValue]
    }

    protected onConnect(): void {
        super.onConnect()
        this.Component = this.getReactComponent()

        this.syncDocumentFromAttribute()
    }

    protected syncDocumentFromAttribute(): void {
        const raw = this.getAttribute(ATTR.documentValue)
        if (!raw || !raw.trim()) return

        const decoded = this.decodeDocument(raw)
        if (decoded !== null) this.document = decoded
    }

    protected decodeDocument(raw: string): DocumentData | null {
        const result = DocumentDataCodec.decode(raw)
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
                document: this.document,
                onActionClose: () => {
                    this.emitEmpty(EVT.actionClose)
                },
            }),
        )
    }
}
