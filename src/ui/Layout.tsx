import { ReactNode } from 'react'

import { RootProps, rootProps } from './internal/root'

type LayoutProps = RootProps & { children: ReactNode }

/**
 * Parts one under another, spaced by the design system's gap. `loose` for
 * parts that are separate things rather than a list of like ones.
 */
export function Stack({ loose, children, ...props }: LayoutProps & { loose?: boolean }) {
    return <div {...rootProps(props, 'ui-stack', loose && 'ui-stack--loose')}>{children}</div>
}

const ALIGN = { start: undefined, between: 'ui-inline--between', end: 'ui-inline--end' }

/**
 * Parts in a row that wraps. `between` pushes them to both ends, `end` to the
 * inline end (the right in a left-to-right language).
 */
export function Inline({
    align = 'start',
    children,
    ...props
}: LayoutProps & { align?: 'start' | 'between' | 'end' }) {
    return <div {...rootProps(props, 'ui-inline', ALIGN[align])}>{children}</div>
}

/** Like things in columns as wide as the space allows. */
export function Grid({ children, ...props }: LayoutProps) {
    return <div {...rootProps(props, 'ui-grid')}>{children}</div>
}

/**
 * Two areas side by side, the first twice the width of the second; they stack
 * when too narrow, the first first.
 */
export function Split({ children, ...props }: LayoutProps) {
    return <div {...rootProps(props, 'ui-split')}>{children}</div>
}

/** Centered, at a readable width. */
export function Center({ children, ...props }: LayoutProps) {
    return <div {...rootProps(props, 'ui-center')}>{children}</div>
}
