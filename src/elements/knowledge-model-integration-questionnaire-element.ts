import React from 'react'

import { IntegrationReply, IntegrationReplyCodec } from '../data/integration-reply-data'
import { ATTR, EVT } from '../protocol'
import { JsonCodec } from '../utils'
import { BaseElement } from './base-element'

export type KnowledgeModelIntegrationQuestionnaireComponentProps<S, U, P> = {
    settings: S
    userSettings: U
    pluginIntegrationSettings: P | null
    integrationReply: IntegrationReply | null
    onReplyChange: (reply: IntegrationReply) => void
}

export type KnowledgeModelIntegrationQuestionnaireComponent<S, U, P> = React.ComponentType<
    KnowledgeModelIntegrationQuestionnaireComponentProps<S, U, P>
>

export abstract class KnowledgeModelIntegrationQuestionnaireElement<S, U, P> extends BaseElement<
    S,
    U
> {
    protected Component: KnowledgeModelIntegrationQuestionnaireComponent<S, U, P> | null = null
    protected pluginIntegrationSettings: P | null = null
    protected integrationReply: IntegrationReply | null = null

    abstract getReactComponent(): KnowledgeModelIntegrationQuestionnaireComponent<S, U, P>
    abstract getPluginIntegrationSettingsDataCodec(): JsonCodec<P>

    static get observedAttributes(): string[] {
        return [...super.observedAttributes, ATTR.integrationReply, ATTR.pluginIntegrationSettings]
    }

    protected onConnect(): void {
        super.onConnect()
        this.Component = this.getReactComponent()

        this.syncPluginIntegrationSettingsFromAttributes()
        this.syncIntegrationReplyFromAttributes()
    }

    protected onAttributeChanged(name: string): void {
        super.onAttributeChanged(name)

        if (name === ATTR.integrationReply) this.syncIntegrationReplyFromAttributes()
        if (name === ATTR.pluginIntegrationSettings)
            this.syncPluginIntegrationSettingsFromAttributes()
    }

    protected syncPluginIntegrationSettingsFromAttributes(): void {
        const raw = this.getAttribute(ATTR.pluginIntegrationSettings)
        if (!raw || !raw.trim()) return

        const decoded = this.decodePluginIntegrationSettings(raw)
        if (decoded !== null) this.pluginIntegrationSettings = decoded
    }

    protected decodePluginIntegrationSettings(raw: string): P | null {
        const result = this.getPluginIntegrationSettingsDataCodec().decode(raw)
        return result.ok ? result.value : null
    }

    protected syncIntegrationReplyFromAttributes(): void {
        this.integrationReply = null

        const raw = this.getAttribute(ATTR.integrationReply)
        if (!raw || !raw.trim()) return

        const decoded = this.decodeIntegrationReply(raw)
        if (decoded !== null) this.integrationReply = decoded
    }

    protected decodeIntegrationReply(raw: string): IntegrationReply | null {
        const result = IntegrationReplyCodec.decode(raw)
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
                pluginIntegrationSettings: this.pluginIntegrationSettings,
                integrationReply: this.integrationReply,
                onReplyChange: (next) => {
                    this.integrationReply = next
                    const serialized = IntegrationReplyCodec.encode(next)
                    this.requestRender()
                    this.emit(EVT.replyValueChange, { value: serialized })
                },
            }),
        )
    }
}
