import { Key, ReactNode } from 'react'

import { RootProps, rootProps } from './internal/root'
import { useUiWords } from './Words'

export type TableColumn<T> = {
    /** Identifies the column; it is what a sort names. */
    key: string
    label: string
    render: (row: T) => ReactNode
    /** The header is a button that asks for a sort by this column (`onSort`). */
    sortable?: boolean
    /**
     * What can be done to a row: the last column, aligned to the end, with
     * nothing but buttons in it — small icon buttons with tooltips.
     */
    actions?: boolean
    /** A header of its own in place of the label, which still names the column. */
    header?: ReactNode
}

export type TableSort = { key: string; direction: 'ascending' | 'descending' }

export type TableProps<T> = RootProps & {
    columns: TableColumn<T>[]
    rows: T[]
    /** A row's React key; its index unless told otherwise. */
    rowKey?: (row: T, index: number) => Key
    /** What the table is, for assistive technology and on the screen. */
    caption?: string
    sort?: TableSort
    onSort?: (key: string) => void
}

/** Data in rows and columns, with its header scope, caption and sort said. */
export function Table<T>({
    columns,
    rows,
    rowKey,
    caption,
    sort,
    onSort,
    ...props
}: TableProps<T>) {
    const words = useUiWords()
    const sortedColumn = sort && columns.find((column) => column.key === sort.key)
    return (
        <div {...rootProps(props, 'ui-table-wrapper')}>
            <table className="ui-table">
                {caption !== undefined && (
                    <caption className="ui-table__caption">{caption}</caption>
                )}
                <thead>
                    <tr>
                        {columns.map((column) => {
                            const direction = sort?.key === column.key ? sort.direction : undefined
                            const className = column.actions
                                ? 'ui-table__th ui-table__th--actions'
                                : 'ui-table__th'
                            if (column.header !== undefined) {
                                return (
                                    <th key={column.key} scope="col" className={className}>
                                        {column.header}
                                    </th>
                                )
                            }
                            return (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className={className}
                                    aria-sort={direction}
                                >
                                    {column.sortable && onSort ? (
                                        <button
                                            className="ui-table__sort"
                                            onClick={() => onSort(column.key)}
                                        >
                                            {column.label}
                                        </button>
                                    ) : (
                                        column.label
                                    )}
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={rowKey ? rowKey(row, index) : index} className="ui-table__row">
                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    className={
                                        column.actions
                                            ? 'ui-table__td ui-table__td--actions'
                                            : 'ui-table__td'
                                    }
                                >
                                    {column.actions ? (
                                        <div className="ui-table__actions">
                                            {column.render(row)}
                                        </div>
                                    ) : (
                                        column.render(row)
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {sort && (
                <div className="ui-visually-hidden" aria-live="polite">
                    {words.tableSorted(
                        sortedColumn?.label ?? sort.key,
                        sort.direction === 'ascending',
                    )}
                </div>
            )}
        </div>
    )
}
