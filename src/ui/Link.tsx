import { MouseEvent, ReactNode } from 'react'

import { Icon } from './Icon'
import { RootProps, rootProps } from './internal/root'
import { useUiWords } from './Words'

export type LinkProps = RootProps & {
    href: string
    /** Opens in a new tab, with the mark and the notice that say so. */
    external?: boolean
    /** Something destructive at the end of it. */
    danger?: boolean
    icon?: string
    children: ReactNode
}

/**
 * Words you follow, in a sentence or under a form. A link that should look
 * like a button is a `LinkButton`.
 */
export function Link({ href, external, danger, icon, children, ...props }: LinkProps) {
    const words = useUiWords()
    const target = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return (
        <a href={href} {...target} {...rootProps(props, 'ui-link', danger && 'ui-link--danger')}>
            {icon && (
                <span className="ui-link__icon">
                    <Icon name={icon} />
                </span>
            )}
            {children}
            {external && (
                <span className="ui-link__external">
                    <Icon name="fa-arrow-up-right-from-square" />
                    <span className="ui-visually-hidden"> {words.newTab}</span>
                </span>
            )}
        </a>
    )
}

export type ActionLinkProps = RootProps & {
    onClick: (event: MouseEvent<HTMLButtonElement>) => void
    children: ReactNode
}

/** An action that reads as a link, in a sentence: a `button` styled as a link. */
export function ActionLink({ onClick, children, ...props }: ActionLinkProps) {
    return (
        <button type="button" onClick={onClick} {...rootProps(props, 'ui-link', 'ui-link--action')}>
            {children}
        </button>
    )
}
