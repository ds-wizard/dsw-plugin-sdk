import { ReactNode } from 'react'

import { Icon } from './Icon'
import { RootProps, rootProps } from './internal/root'
import { useUiWords } from './Words'

type ContainerProps = RootProps & { children: ReactNode }

/**
 * A form's buttons, under it. Save is never disabled because the form is not
 * valid yet: it is pressed, and what is wrong is said (`ErrorSummary` and the
 * fields' errors).
 */
export function FormActions({ children, ...props }: ContainerProps) {
    return <div {...rootProps(props, 'ui-form-actions')}>{children}</div>
}

/** Fields that belong to the one above them, indented under it. */
export function FormNested({ children, ...props }: ContainerProps) {
    return <div {...rootProps(props, 'ui-form-nested')}>{children}</div>
}

/** Fields shown but not editable. */
export function ReadOnlyForm({ children, ...props }: ContainerProps) {
    return (
        <fieldset disabled {...rootProps(props, 'ui-form-readonly')}>
            {children}
        </fieldset>
    )
}

export type FormCollapsibleProps = ContainerProps & {
    label: string
    open?: boolean
}

/** Fields most will not need, behind their name ("Advanced"). */
export function FormCollapsible({ label, open, children, ...props }: FormCollapsibleProps) {
    return (
        <details open={open} {...rootProps(props, 'ui-form-collapsible')}>
            <summary className="ui-form-collapsible__summary">
                <span className="ui-form-collapsible__chevron" aria-hidden="true">
                    <Icon name="fa-chevron-right" />
                </span>
                {label}
            </summary>
            <div className="ui-form-nested">{children}</div>
        </details>
    )
}

export type ErrorSummaryProps = RootProps & {
    /** What is wrong, one sentence each; nothing is drawn when there is nothing. */
    errors: string[]
    title?: string
}

/**
 * Why the form was not sent, above it. It is announced as it appears; move
 * focus to it (its id is `ui-form-errors` unless given another) after a submit
 * that failed.
 */
export function ErrorSummary({ errors, title, ...props }: ErrorSummaryProps) {
    const words = useUiWords()
    if (errors.length === 0) return null
    return (
        <div
            tabIndex={-1}
            role="alert"
            {...rootProps({ id: 'ui-form-errors', ...props }, 'ui-form-errors')}
        >
            <h3 className="ui-subtitle">{title ?? words.errorSummaryTitle}</h3>
            <ul className="ui-form-errors__list">
                {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
            </ul>
        </div>
    )
}
