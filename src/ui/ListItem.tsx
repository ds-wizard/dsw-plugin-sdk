import { Children, ReactNode } from 'react'

import { RootProps, rootProps } from './internal/root'

export type ListProps = RootProps & {
    /** `ListItem`s. */
    children: ReactNode
    /** Tiles in a grid rather than rows. */
    tiles?: boolean
}

/** The list the product uses far more than tables. */
export function List({ tiles, children, ...props }: ListProps) {
    return (
        <ul {...rootProps(props, 'ui-list', tiles && 'ui-list--tiles')}>
            {Children.toArray(children)}
        </ul>
    )
}

export type ListItemProps = RootProps & {
    /** The item's name, usually a link to it. */
    title: ReactNode
    /** An `ItemIcon` or an `Icon` before it. */
    icon?: ReactNode
    /** Short facts after the title: a `Badge`, a version, a count. */
    fragments?: ReactNode[]
    /** A sentence after the fragments. */
    description?: string
    /** When it happened: the date as a machine reads it, as it is shown, and in full on hover. */
    timestamp?: { dateTime: string; label: string; title?: string }
    /** Buttons at the end of the row. */
    actions?: ReactNode
    /** Something under the row, inside the item. */
    detail?: ReactNode
    highlighted?: boolean
    /** The whole row follows the link in its title. */
    rowLink?: boolean
}

export function ListItem({
    title,
    icon,
    fragments = [],
    description,
    timestamp,
    actions,
    detail,
    highlighted,
    rowLink,
    ...props
}: ListItemProps) {
    const hasFragments = fragments.length > 0 || description !== undefined
    return (
        <li
            {...rootProps(
                props,
                'ui-list__item',
                highlighted && 'is-highlighted',
                rowLink && 'ui-list__item--row-link',
            )}
        >
            <div className="ui-list__row">
                {icon && <div className="ui-list__icon">{icon}</div>}
                <div className="ui-list__content">
                    <div className="ui-list__title">{title}</div>
                    {hasFragments && (
                        <div className="ui-list__fragments">
                            {fragments.map((fragment, index) => (
                                <span key={index} className="ui-list__fragment">
                                    {fragment}
                                </span>
                            ))}
                            {description !== undefined && (
                                <span className="ui-list__fragment ui-list__fragment--description">
                                    {description}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                {timestamp && (
                    <time
                        className="ui-list__timestamp"
                        dateTime={timestamp.dateTime}
                        title={timestamp.title}
                    >
                        {timestamp.label}
                    </time>
                )}
                {actions && <div className="ui-list__actions">{actions}</div>}
            </div>
            {detail && <div className="ui-list__detail">{detail}</div>}
        </li>
    )
}
