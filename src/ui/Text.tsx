import { ReactNode } from 'react'

import { RootProps, rootProps } from './internal/root'

export type HeadingLevel = 2 | 3 | 4 | 5 | 6

type TextProps = RootProps & { children: ReactNode }

type HeadingProps = TextProps & {
    /** The heading's level; the page's `h1` is the app's, so 2 to 6. */
    level?: HeadingLevel
}

function heading(level: HeadingLevel, className: string, { children, ...props }: TextProps) {
    const Tag = `h${level}` as const
    return <Tag {...rootProps(props, className)}>{children}</Tag>
}

/** A section's heading, an `h2` unless told otherwise. */
export function Title({ level = 2, ...props }: HeadingProps) {
    return heading(level, 'ui-title', props)
}

/** A heading under a title, an `h3` unless told otherwise. */
export function Subtitle({ level = 3, ...props }: HeadingProps) {
    return heading(level, 'ui-subtitle', props)
}

export function Body({ children, ...props }: TextProps) {
    return <p {...rootProps(props, 'ui-body')}>{children}</p>
}

export function BodySmall({ children, ...props }: TextProps) {
    return <p {...rootProps(props, 'ui-body-sm')}>{children}</p>
}

/** Secondary text, in a color that still reads at 4.5:1. */
export function Muted({ children, ...props }: TextProps) {
    return <span {...rootProps(props, 'ui-body-sm', 'ui-text--muted')}>{children}</span>
}

export function Label({ children, ...props }: TextProps) {
    return <span {...rootProps(props, 'ui-label')}>{children}</span>
}

/** An identifier, a value or a path, inline. */
export function Code({ children, ...props }: TextProps) {
    return <span {...rootProps(props, 'ui-code')}>{children}</span>
}

/** An error said in a sentence, with its mark. */
export function ErrorText({ children, ...props }: TextProps) {
    return (
        <p {...rootProps(props, 'ui-text-error')}>
            <span className="ui-text-error__icon" aria-hidden="true">
                !
            </span>
            <span>{children}</span>
        </p>
    )
}

/** For assistive technology, not for the eye. */
export function VisuallyHidden({ children, ...props }: TextProps) {
    return <span {...rootProps(props, 'ui-visually-hidden')}>{children}</span>
}
