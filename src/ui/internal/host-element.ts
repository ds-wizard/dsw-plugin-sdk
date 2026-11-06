import { useEffect, useRef } from 'react'

/**
 * A custom element the app defines (`ui-date-picker`, `ui-markdown-editor`),
 * driven as the app's Elm drives it: its value is a property, set whenever
 * it differs, and its changes come as an event that names no value — the
 * element's property holds it.
 */
export function useHostValue<E extends HTMLElement>(
    property: string,
    event: string,
    value: string,
    onChange: (value: string) => void,
) {
    const ref = useRef<E>(null)
    const latest = useRef(onChange)
    latest.current = onChange

    useEffect(() => {
        const element = ref.current as unknown as Record<string, unknown> | null
        if (element && element[property] !== value) element[property] = value
    }, [property, value])

    useEffect(() => {
        const element = ref.current
        if (!element) return
        const listener = () =>
            latest.current(String((element as unknown as Record<string, unknown>)[property] ?? ''))
        element.addEventListener(event, listener)
        return () => element.removeEventListener(event, listener)
    }, [property, event])

    return ref
}

/** A boolean attribute of a custom element: present or absent. */
export function flag(on: boolean | undefined): '' | undefined {
    return on ? '' : undefined
}
