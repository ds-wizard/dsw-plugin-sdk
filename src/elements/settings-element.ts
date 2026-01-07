import React from 'react'
import { ComponentType } from 'react'

import { ATTR, EVT } from '../protocol'
import { JsonCodec } from '../utils/json'
import { ReactElement } from './react-element'

export type SettingsComponentProps<S> = {
    settings: S
    onSettingsChange: (data: S) => void
}

export type SettingsComponent<S> = ComponentType<SettingsComponentProps<S>>

export abstract class SettingsElement<S> extends ReactElement {
    protected Component!: SettingsComponent<S>
    protected settings!: S

    abstract getSettingsDataCodec(): JsonCodec<S>
    abstract getReactComponent(): SettingsComponent<S>

    static get observedAttributes(): string[] {
        return [ATTR.settingsValue]
    }

    protected onConnect(): void {
        this.settings = this.getSettingsDataCodec().init()
        this.Component = this.getReactComponent()
        this.syncSettingsFromAttribute()
    }

    protected onAttributeChanged(name: string): void {
        if (name === ATTR.settingsValue) this.syncSettingsFromAttribute()
    }

    protected syncSettingsFromAttribute(): void {
        const raw = this.getAttribute(ATTR.settingsValue)
        if (!raw || !raw.trim()) return

        const decoded = this.decodeSettings(raw)
        if (decoded !== null) this.settings = decoded
    }

    protected decodeSettings(raw: string): S | null {
        const result = this.getSettingsDataCodec().decode(raw)
        return result.ok ? result.value : null
    }

    protected render(): void {
        if (!this.root) return

        this.root.render(
            React.createElement(this.Component, {
                settings: this.settings,
                onSettingsChange: (next) => {
                    this.settings = next
                    const serialized = this.getSettingsDataCodec().encode(next)

                    this.requestRender()
                    this.emit(EVT.settingsValueChange, { value: serialized })
                },
            }),
        )
    }
}
