import { Children, ReactNode } from 'react'

import { Icon } from './Icon'
import { RootProps, rootProps } from './internal/root'
import { useUiWords } from './Words'

export type TagProps = RootProps & {
    label: string
    /** A swatch of this color before the label. */
    color?: string
    /** Makes the tag removable, with a button named "Remove <label>". */
    onRemove?: () => void
    /** Another name for the remove button. */
    removeLabel?: string
}

/** A label on something: a project's tags, a package's keywords. */
export function Tag({ label, color, onRemove, removeLabel, ...props }: TagProps) {
    const words = useUiWords()
    return (
        <span {...rootProps(props, 'ui-tag', onRemove && 'ui-tag--removable')}>
            {color && (
                <span
                    className="ui-tag__swatch"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                />
            )}
            <span className="ui-tag__label">{label}</span>
            {onRemove && (
                <button
                    type="button"
                    className="ui-tag__remove"
                    aria-label={removeLabel ?? words.remove(label)}
                    onClick={onRemove}
                >
                    <Icon name="fa-xmark" />
                </button>
            )}
        </span>
    )
}

/** Tags in a list; nothing at all when there are none. */
export function TagList({ children, ...props }: RootProps & { children: ReactNode }) {
    const tags = Children.toArray(children)
    if (tags.length === 0) return null
    return (
        <ul {...rootProps(props, 'ui-tag-list')}>
            {tags.map((tag, index) => (
                <li key={index} className="ui-tag-list__item">
                    {tag}
                </li>
            ))}
        </ul>
    )
}
