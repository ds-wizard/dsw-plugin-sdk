import { ATTR } from '../protocol'
import { JsonCodec } from '../utils/json'
import { ReactElement } from './react-element'

export abstract class BaseElement<S, U> extends ReactElement {
    protected settings!: S
    protected userSettings!: U

    static get observedAttributes(): string[] {
        return [ATTR.settingsValue, ATTR.userSettingsValue]
    }

    abstract getSettingsDataCodec(): JsonCodec<S>
    abstract getUserSettingsDataCodec(): JsonCodec<U>

    protected onConnect(): void {
        this.settings = this.getSettingsDataCodec().init()
        this.userSettings = this.getUserSettingsDataCodec().init()

        this.syncSettingsFromAttribute()
        this.syncUserSettingsFromAttribute()
    }

    protected onAttributeChanged(name: string): void {
        if (name === ATTR.settingsValue) this.syncSettingsFromAttribute()
        if (name === ATTR.userSettingsValue) this.syncUserSettingsFromAttribute()
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

    protected decodeSettings(raw: string): S | null {
        const result = this.getSettingsDataCodec().decode(raw)
        return result.ok ? result.value : null
    }

    protected decodeUserSettings(raw: string): U | null {
        const result = this.getUserSettingsDataCodec().decode(raw)
        return result.ok ? result.value : null
    }
}
