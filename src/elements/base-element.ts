import { UserData, UserDataCodec } from '../data/user-data'
import { ATTR } from '../protocol'
import { JsonCodec } from '../utils/json'
import { ReactElement } from './react-element'

export abstract class BaseElement<S, U> extends ReactElement {
    protected settings!: S
    protected userSettings!: U
    protected user: UserData | null = null

    static get observedAttributes(): string[] {
        return [ATTR.settingsValue, ATTR.userSettingsValue, ATTR.userValue]
    }

    abstract getSettingsDataCodec(): JsonCodec<S>
    abstract getUserSettingsDataCodec(): JsonCodec<U>

    protected onConnect(): void {
        this.settings = this.getSettingsDataCodec().init()
        this.userSettings = this.getUserSettingsDataCodec().init()

        this.syncSettingsFromAttribute()
        this.syncUserSettingsFromAttribute()
        this.syncUserFromAttribute()
    }

    protected onAttributeChanged(name: string): void {
        if (name === ATTR.settingsValue) this.syncSettingsFromAttribute()
        if (name === ATTR.userSettingsValue) this.syncUserSettingsFromAttribute()
        if (name === ATTR.userValue) this.syncUserFromAttribute()
    }

    protected syncSettingsFromAttribute(): void {
        const raw = this.getAttribute(ATTR.settingsValue)
        if (!raw || !raw.trim()) return

        const decoded = this.decodeSettings(raw)
        if (decoded !== null) this.settings = decoded
    }

    protected syncUserSettingsFromAttribute(): void {
        const raw = this.getAttribute(ATTR.userSettingsValue)
        if (!raw || !raw.trim()) return

        const decoded = this.decodeUserSettings(raw)
        if (decoded !== null) this.userSettings = decoded
    }

    protected syncUserFromAttribute(): void {
        const raw = this.getAttribute(ATTR.userValue)
        if (!raw || !raw.trim()) return

        const decoded = this.decodeUser(raw)
        if (decoded !== null) this.user = decoded
    }

    protected decodeSettings(raw: string): S | null {
        const result = this.getSettingsDataCodec().decode(raw)
        return result.ok ? result.value : null
    }

    protected decodeUserSettings(raw: string): U | null {
        const result = this.getUserSettingsDataCodec().decode(raw)
        return result.ok ? result.value : null
    }

    protected decodeUser(raw: string): UserData | null {
        const result = UserDataCodec.decode(raw)
        return result.ok ? result.value : null
    }
}
