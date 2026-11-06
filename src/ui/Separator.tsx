import { RootProps, rootProps } from './internal/root'

export type SeparatorProps = RootProps & {
    /** A word in the middle of the line, such as "or". */
    label?: string
    /** A line between things on one line, hidden from assistive technology. */
    vertical?: boolean
}

export function Separator({ label, vertical, ...props }: SeparatorProps) {
    if (vertical) {
        return (
            <span
                aria-hidden="true"
                {...rootProps(props, 'ui-separator', 'ui-separator--vertical')}
            />
        )
    }
    if (label !== undefined) {
        return (
            <div
                role="separator"
                aria-label={label}
                {...rootProps(props, 'ui-separator', 'ui-separator--labeled')}
            >
                <span className="ui-separator__label" aria-hidden="true">
                    {label}
                </span>
            </div>
        )
    }
    return <hr {...rootProps(props, 'ui-separator')} />
}
