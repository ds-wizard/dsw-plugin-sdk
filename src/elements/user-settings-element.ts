import React from 'react'

import { UserData } from '../data/user-data'
import { EVT } from '../protocol'
import { BaseElement } from './base-element'

export type UserSettingsComponentProps<S, U> = {
    settings: S
    userSettings: U
    user: UserData | null
    onUserSettingsChange: (next: U) => void
}

export type UserSettingsComponent<S, U> = React.ComponentType<UserSettingsComponentProps<S, U>>

export abstract class UserSettingsElement<S, U> extends BaseElement<S, U> {
    protected Component: UserSettingsComponent<S, U> | null = null

    abstract getReactComponent(): UserSettingsComponent<S, U>

    protected onConnect(): void {
        super.onConnect()
        this.Component = this.getReactComponent()
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
                onUserSettingsChange: (next) => {
                    this.userSettings = next
                    const serialized = this.getUserSettingsDataCodec().encode(next)

                    // emit only user settings changes
                    this.emit(EVT.userSettingsValueChange, { value: serialized })

                    this.requestRender()
                },
            }),
        )
    }
}
