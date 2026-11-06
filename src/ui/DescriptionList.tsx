import { Fragment, ReactNode } from 'react'

import { RootProps, rootProps } from './internal/root'

export type DescriptionListItem = {
    term: string
    description: ReactNode
    /** Makes the entry a target of an in-page link: its term gets the id. */
    targetId?: string
}

export type DescriptionListProps = RootProps & {
    items: DescriptionListItem[]
}

/** Label-and-value pairs, stacked. */
export function DescriptionList({ items, ...props }: DescriptionListProps) {
    return (
        <dl {...rootProps(props, 'ui-description-list')}>
            {items.map((item, index) => (
                <Fragment key={index}>
                    <dt
                        className="ui-description-list__term"
                        id={item.targetId}
                        tabIndex={item.targetId ? -1 : undefined}
                    >
                        {item.term}
                    </dt>
                    <dd className="ui-description-list__description">{item.description}</dd>
                </Fragment>
            ))}
        </dl>
    )
}
