import { ReactNode } from 'react'

import { RootProps, rootProps } from './internal/root'
import { HeadingLevel } from './Text'

export type EmptyStateProps = RootProps & {
    title: string
    description: string
    /** The one thing to do about it, a `Button` or a `LinkButton`. */
    action?: ReactNode
    /** The title's level, 2 unless told otherwise. */
    headingLevel?: HeadingLevel
}

/** Nothing to show yet: a list with no items, a search with no results. */
export function EmptyState({
    title,
    description,
    action,
    headingLevel = 2,
    ...props
}: EmptyStateProps) {
    const Heading = `h${headingLevel}` as const
    return (
        <div {...rootProps(props, 'ui-empty-state')}>
            <div className="ui-empty-state__text">
                <Heading className="ui-empty-state__title">{title}</Heading>
                <p className="ui-empty-state__description">{description}</p>
            </div>
            {action && <div className="ui-empty-state__action">{action}</div>}
        </div>
    )
}
