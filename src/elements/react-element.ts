import { createRoot, Root } from 'react-dom/client'

export abstract class ReactElement extends HTMLElement {
    protected mount: HTMLElement | null = null
    protected root: Root | null = null
    protected renderQueued = false

    connectedCallback(): void {
        if (this.root) return

        this.mount = document.createElement('span')
        this.appendChild(this.mount)
        this.root = createRoot(this.mount)

        this.onConnect()
        this.requestRender()
    }

    disconnectedCallback(): void {
        this.renderQueued = false

        this.onDisconnect()

        this.root?.unmount()
        this.root = null

        this.mount?.remove()
        this.mount = null
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        if (oldValue === newValue) return

        this.onAttributeChanged(name, oldValue, newValue)
        this.requestRender()
    }

    /** Subclass hook: initialize state, read initial attributes, etc. */
    protected onConnect(): void {}

    /** Subclass hook: cleanup timers, subscriptions, etc. */
    protected onDisconnect(): void {}

    /** Subclass hook: update internal state from attribute changes (can handle many attributes). */
    protected onAttributeChanged(
        _name: string,
        _oldValue: string | null,
        _newValue: string | null,
    ): void {}

    protected requestRender(): void {
        if (this.renderQueued) return
        this.renderQueued = true
        queueMicrotask(() => {
            this.renderQueued = false
            this.render()
        })
    }

    /** Subclass must render into this.root. */
    protected abstract render(): void

    /** Helper for consistent event dispatch */
    protected emit<TDetail extends object>(type: string, detail: TDetail): void {
        this.dispatchEvent(
            new CustomEvent(type, {
                detail,
                bubbles: true,
                composed: true,
            }),
        )
    }

    protected emitEmpty(type: string): void {
        this.dispatchEvent(
            new CustomEvent(type, {
                bubbles: true,
                composed: true,
            }),
        )
    }
}
