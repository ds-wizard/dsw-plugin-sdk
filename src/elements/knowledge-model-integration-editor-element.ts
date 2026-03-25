import React from 'react'

import { ATTR, EVT } from '../protocol'
import { JsonCodec } from '../utils'
import { BaseElement } from './base-element'

export type KnowledgeModelIntegrationEditorComponentProps<S, U, P> = {
    settings: S
    userSettings: U
    pluginIntegrationSettings: P | null
    onPluginIntegrationSettingsChange: (pluginIntegrationSettings: P) => void
}

export type KnowledgeModelIntegrationEditorComponent<S, U, P> = React.ComponentType<
    KnowledgeModelIntegrationEditorComponentProps<S, U, P>
>

export abstract class KnowledgeModelIntegrationEditorElement<S, U, P> extends BaseElement<S, U> {
    protected Component: KnowledgeModelIntegrationEditorComponent<S, U, P> | null = null
    protected pluginIntegrationSettings: P | null = null

    abstract getReactComponent(): KnowledgeModelIntegrationEditorComponent<S, U, P>
    abstract getPluginIntegrationSettingsDataCodec(): JsonCodec<P>

    static get observedAttributes(): string[] {
        return [...super.observedAttributes, ATTR.pluginIntegrationSettings]
    }

    protected onConnect(): void {
        super.onConnect()
        this.Component = this.getReactComponent()

        this.syncPluginIntegrationSettingsFromAttributes()
    }

    protected onAttributeChanged(name: string): void {
        super.onAttributeChanged(name)

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

    protected render(): void {
        const root = this.root
        const Component = this.Component
        if (!root || !Component) return

        root.render(
            React.createElement(Component, {
                settings: this.settings,
                userSettings: this.userSettings,
                pluginIntegrationSettings: this.pluginIntegrationSettings,
                onPluginIntegrationSettingsChange: (next) => {
                    this.pluginIntegrationSettings = next
                    const serialized = this.getPluginIntegrationSettingsDataCodec().encode(next)
                    this.emit(EVT.pluginIntegrationSettingsChange, { value: serialized })

                    this.requestRender()
                },
            }),
        )
    }
}
