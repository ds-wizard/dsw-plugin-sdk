import { ReactNode } from 'react'

import { Icon } from './Icon'
import { RootProps, rootProps } from './internal/root'

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'inverse'

const TONES: Record<BadgeTone, string | undefined> = {
    neutral: undefined,
    success: 'ui-badge--success',
    warning: 'ui-badge--warning',
    danger: 'ui-badge--danger',
    info: 'ui-badge--info',
    inverse: 'ui-badge--inverse',
}

export type BadgeProps = RootProps & {
    tone?: BadgeTone
    icon?: string
    /** What the badge means, read out after its label and shown on hover. */
    description?: string
    /** A badge that does something is a button… */
    onClick?: () => void
    /** …and one that goes somewhere is a link. */
    href?: string
    children: ReactNode
}

/** A short label on something: a status, a count, a version. */
export function Badge({
    tone = 'neutral',
    icon,
    description,
    onClick,
    href,
    children,
    ...props
}: BadgeProps) {
    const modifier = TONES[tone]
    const content = (
        <>
            {icon && (
                <span aria-hidden="true">
                    <Icon name={icon} />
                </span>
            )}
            {children}
            {description && <span className="ui-visually-hidden">: {description}</span>}
        </>
    )
    if (href !== undefined) {
        return (
            <a
                href={href}
                title={description}
                {...rootProps(props, 'ui-badge', modifier, 'ui-badge--link')}
            >
                {content}
            </a>
        )
    }
    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                title={description}
                {...rootProps(props, 'ui-badge', modifier, 'ui-badge--action')}
            >
                {content}
            </button>
        )
    }
    return (
        <span title={description} {...rootProps(props, 'ui-badge', modifier)}>
            {content}
        </span>
    )
}
