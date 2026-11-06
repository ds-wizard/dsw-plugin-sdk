import { AriaAttributes, CSSProperties } from 'react'

export type DataAttributes = { [key: `data-${string}`]: string | number | boolean | undefined }

/**
 * What every component takes for its root element besides its own props. The
 * props are the way to a look; `className` and `style` are an escape hatch for
 * what the design system does not foresee, added to its classes, never in
 * their place.
 */
export type RootProps = {
    id?: string
    className?: string
    style?: CSSProperties
} & AriaAttributes &
    DataAttributes

/** Joins classes, skipping the empty ones. */
export function cx(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(' ')
}

/**
 * The root element's attributes: the component's classes with the caller's
 * after them, and the caller's `id`, `style`, `aria-*` and `data-*`.
 */
export function rootProps(props: RootProps, ...classes: (string | false | null | undefined)[]) {
    const passed: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(props)) {
        if (key.startsWith('aria-') || key.startsWith('data-')) passed[key] = value
    }
    return {
        ...passed,
        id: props.id,
        style: props.style,
        className: cx(...classes, props.className),
    }
}

/** The root props out of a component's props, and the rest. */
export function splitRoot<P extends RootProps>(props: P): [RootProps, Omit<P, keyof RootProps>] {
    const root: Record<string, unknown> = {}
    const rest: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(props)) {
        if (
            key === 'id' ||
            key === 'className' ||
            key === 'style' ||
            key.startsWith('aria-') ||
            key.startsWith('data-')
        ) {
            root[key] = value
        } else {
            rest[key] = value
        }
    }
    return [root as RootProps, rest as Omit<P, keyof RootProps>]
}
