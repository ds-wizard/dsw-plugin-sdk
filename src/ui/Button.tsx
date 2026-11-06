import { MouseEvent, ReactElement, ReactNode } from 'react'

import { Icon } from './Icon'
import { cx, RootProps, rootProps } from './internal/root'
import { Tooltip } from './Tooltip'
import { useUiWords } from './Words'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'dangerSecondary' | 'ghost'

export type ButtonSize = 'small' | 'medium' | 'large'

type CommonProps = RootProps & {
    variant?: ButtonVariant
    size?: ButtonSize
    /** No border and no fill: a button among the controls of a dense toolbar. */
    quiet?: boolean
    /** Font Awesome classes of an icon before the label. */
    icon?: string
    /** Working on it: a spinner, `aria-busy`, and no second press. */
    loading?: boolean
    /** Done: a check mark in place of the spinner. */
    done?: boolean
    disabled?: boolean
    /**
     * Unavailable, and why. Unlike `disabled`, the button stays focusable and
     * the reason is a tooltip and its description, so a keyboard and a screen
     * reader get it too. `id` is the tooltip's, unique on the page.
     */
    disabledReason?: { id: string; reason: string }
    /** A count or a status after the label, a `Badge`. */
    badge?: ReactElement
    /** Another accessible name than the label. */
    accessibleName?: string
}

export type ButtonProps = CommonProps & {
    /** A toggle: `aria-pressed`, and the selected tint while pressed. */
    pressed?: boolean
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void
    children: ReactNode
}

export type SubmitButtonProps = CommonProps & {
    children: ReactNode
}

export type LinkButtonProps = CommonProps & {
    href: string
    /** Opens in a new tab, with the mark and the notice that say so. */
    external?: boolean
    children: ReactNode
}

export type IconButtonProps = Omit<CommonProps, 'icon' | 'accessibleName' | 'badge'> & {
    icon: string
    /** The button's name; it has no other. */
    label: string
    /** Shows the label as a tooltip. */
    tooltip?: boolean | 'above' | 'start' | 'end'
    pressed?: boolean
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

const VARIANTS: Record<ButtonVariant, string> = {
    primary: 'ui-button--primary',
    secondary: 'ui-button--secondary',
    danger: 'ui-button--danger',
    dangerSecondary: 'ui-button--danger-secondary',
    ghost: 'ui-button--ghost',
}

function variantClass(variant: ButtonVariant, quiet: boolean | undefined): string {
    const danger = variant === 'danger' || variant === 'dangerSecondary'
    if (quiet) return danger ? 'ui-button--quiet ui-button--quiet-danger' : 'ui-button--quiet'
    return VARIANTS[variant]
}

function classes(props: CommonProps, iconOnly: boolean) {
    return [
        'ui-button',
        variantClass(props.variant ?? 'secondary', props.quiet),
        props.size === 'small' && 'ui-button--sm',
        props.size === 'large' && 'ui-button--lg',
        iconOnly && 'ui-button--icon',
        props.loading && !props.done && 'ui-button--loading',
        props.done && 'ui-button--done',
    ]
}

function Content(props: CommonProps & { label?: ReactNode; externalNotice?: string }) {
    return (
        <>
            {props.icon && <Icon name={props.icon} />}
            {props.label !== undefined && <span>{props.label}</span>}
            {props.badge}
            {props.externalNotice && (
                <span className="ui-button__external">
                    <Icon name="fa-arrow-up-right-from-square" />
                    <span className="ui-visually-hidden"> {props.externalNotice}</span>
                </span>
            )}
            {props.done ? (
                <span className="ui-button__done">
                    <Icon name="fa-check" />
                </span>
            ) : (
                props.loading && (
                    <span className="ui-button__spinner">
                        <Icon name="fa-circle-notch" spin />
                    </span>
                )
            )}
        </>
    )
}

function withReason(props: CommonProps, element: ReactElement) {
    if (!props.disabledReason) return element
    return (
        <Tooltip
            label={props.disabledReason.reason}
            placement="end"
            bubbleId={props.disabledReason.id}
        >
            {element}
        </Tooltip>
    )
}

function stateAttributes(props: CommonProps) {
    const busy = props.loading && !props.done
    return {
        'aria-busy': busy ? true : undefined,
        'aria-disabled': props.disabledReason ? true : undefined,
        'aria-describedby': props.disabledReason?.id ?? props['aria-describedby'],
    }
}

function buttonElement(
    type: 'button' | 'submit',
    props: CommonProps & {
        pressed?: boolean
        onClick?: (event: MouseEvent<HTMLButtonElement>) => void
    },
    iconOnly: boolean,
    content: ReactNode,
    extra: Record<string, unknown> = {},
) {
    const unavailable = props.disabled || props.loading || props.done
    return withReason(
        props,
        <button
            {...rootProps(props, ...classes(props, iconOnly))}
            {...stateAttributes(props)}
            {...extra}
            type={props.disabledReason ? 'button' : type}
            disabled={unavailable}
            aria-pressed={props.pressed}
            aria-label={props.accessibleName ?? props['aria-label']}
            onClick={props.disabledReason ? undefined : props.onClick}
        >
            {content}
        </button>,
    )
}

/** An action: a `button type="button"`. */
export function Button({ children, ...props }: ButtonProps) {
    return buttonElement('button', props, false, <Content {...props} label={children} />)
}

/** Sends the form it is in, so Enter in a field sends it too. Usually `variant="primary"`. */
export function SubmitButton({ children, ...props }: SubmitButtonProps) {
    return buttonElement('submit', props, false, <Content {...props} label={children} />)
}

/** An action shown as an icon, named by its label. */
export function IconButton({ label, tooltip, ...props }: IconButtonProps) {
    const tooltipAttributes =
        tooltip && !props.disabledReason
            ? {
                  'data-ui-tooltip': label,
                  'data-ui-tooltip-placement': typeof tooltip === 'string' ? tooltip : undefined,
              }
            : {}
    return buttonElement(
        'button',
        { ...props, accessibleName: label },
        true,
        <Content {...props} />,
        tooltipAttributes,
    )
}

/** Navigation that looks like a button: an `a`, so middle-click and copying the link keep working. */
export function LinkButton({ href, external, children, ...props }: LinkButtonProps) {
    const words = useUiWords()
    const notice = external ? words.newTab : undefined
    const unavailable = props.disabled || props.loading || props.done
    const name = props.accessibleName ?? props['aria-label']
    const linkAttributes = props.disabledReason
        ? { role: 'link', tabIndex: 0 }
        : unavailable
          ? { role: 'link', 'aria-disabled': true }
          : external
            ? { href, target: '_blank', rel: 'noopener noreferrer' }
            : { href }
    return withReason(
        props,
        <a
            {...rootProps(props, ...classes(props, false))}
            {...stateAttributes(props)}
            {...linkAttributes}
            aria-label={name ? cx(name, notice) : undefined}
        >
            <Content {...props} label={children} externalNotice={notice} />
        </a>,
    )
}
