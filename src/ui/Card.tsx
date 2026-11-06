import { ReactNode } from 'react'

import { RootProps, rootProps } from './internal/root'
import { HeadingLevel } from './Text'

export type CardProps = RootProps & {
    title?: string
    /** The title's level, 2 unless told otherwise. */
    headingLevel?: HeadingLevel
    children: ReactNode
}

/** A surface that sets something apart by elevation and space. */
export function Card({ title, headingLevel = 2, children, ...props }: CardProps) {
    const Heading = `h${headingLevel}` as const
    return (
        <div {...rootProps(props, 'ui-card')}>
            {title !== undefined && <Heading className="ui-subtitle">{title}</Heading>}
            {children}
        </div>
    )
}
