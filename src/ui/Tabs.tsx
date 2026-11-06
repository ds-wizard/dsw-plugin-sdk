import { KeyboardEvent, ReactNode, useRef } from 'react'

import { Icon } from './Icon'
import { RootProps, rootProps } from './internal/root'

export type Tab = {
    /** Identifies the tab; what `active` and `onSelect` name. */
    id: string
    label: string
    icon?: string
    /** A `Badge` after the label. */
    badge?: ReactNode
}

export type TabsProps = Omit<RootProps, 'id'> & {
    /** The tab list's id; the panel's is `<id>-panel` (`TabPanel`). */
    id: string
    /** What the tabs switch between, for assistive technology. */
    label: string
    tabs: Tab[]
    active: string
    onSelect: (id: string) => void
    /** The tabs fill the width. */
    full?: boolean
}

/**
 * Tabs within a page: one tab stop, the arrow keys, Home and End move
 * between them and select as they go. Pair them with a `TabPanel` that holds
 * the active tab's content.
 */
export function Tabs({ id, label, tabs, active, onSelect, full, ...props }: TabsProps) {
    const list = useRef<HTMLUListElement>(null)
    const activeIndex = Math.max(
        0,
        tabs.findIndex((tab) => tab.id === active),
    )
    const tabId = (tab: Tab) => `${id}-tab-${tab.id}`

    const onKeyDown = (event: KeyboardEvent) => {
        const count = tabs.length
        const target =
            event.key === 'ArrowRight'
                ? (activeIndex + 1) % count
                : event.key === 'ArrowLeft'
                  ? (activeIndex - 1 + count) % count
                  : event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? count - 1
                      : null
        if (target === null || count === 0) return
        event.preventDefault()
        const tab = tabs[target]
        onSelect(tab.id)
        list.current?.querySelector<HTMLButtonElement>(`[id="${tabId(tab)}"]`)?.focus()
    }

    return (
        <div {...rootProps(props, 'ui-tabs')}>
            <ul
                ref={list}
                id={id}
                role="tablist"
                aria-label={label}
                className={full ? 'ui-tabs__list ui-tabs__list--full' : 'ui-tabs__list'}
                onKeyDown={onKeyDown}
            >
                {tabs.map((tab) => {
                    const selected = tab.id === active
                    return (
                        <li key={tab.id} role="none" className="ui-tabs__item">
                            <button
                                type="button"
                                id={tabId(tab)}
                                role="tab"
                                aria-selected={selected}
                                aria-controls={`${id}-panel`}
                                tabIndex={selected ? 0 : -1}
                                className={selected ? 'ui-tabs__tab is-active' : 'ui-tabs__tab'}
                                onClick={() => onSelect(tab.id)}
                            >
                                {tab.icon && <Icon name={tab.icon} />}
                                <span className="ui-tabs__label" data-label={tab.label}>
                                    {tab.label}
                                </span>
                                {tab.badge}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export type TabPanelProps = {
    /** The `Tabs`' id. */
    tabsId: string
    /** The active tab's label. */
    label: string
    children: ReactNode
}

/** The active tab's content. */
export function TabPanel({ tabsId, label, children }: TabPanelProps) {
    return (
        <div id={`${tabsId}-panel`} role="tabpanel" aria-label={label}>
            {children}
        </div>
    )
}
