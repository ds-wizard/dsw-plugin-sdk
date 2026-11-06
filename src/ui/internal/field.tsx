import { ReactNode, useId } from 'react'

import { RootProps, rootProps } from './root'

// The parts every field shares: its ids, label and messages.

export type FieldProps = Omit<RootProps, 'id'> & {
    /** The control's id; generated when not given. */
    id?: string
    label: string
    /** Said under the control, and read out with it. */
    hint?: ReactNode
    /** Said under the control with its mark; the control is invalid while there is one. */
    error?: string
    warning?: string
    required?: boolean
    disabled?: boolean
    /** The label is still there for assistive technology, not for the eye. */
    hiddenLabel?: boolean
    /** A `Badge` after the label. */
    labelBadge?: ReactNode
}

export type Ids = {
    control: string
    label: string
    hint: string
    error: string
    warning: string
    prefix: string
    suffix: string
}

export function useIds(id: string | undefined): Ids {
    const generated = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const control = id ?? `ui-field-${generated}`
    return {
        control,
        label: `${control}-label`,
        hint: `${control}-hint`,
        error: `${control}-error`,
        warning: `${control}-warning`,
        prefix: `${control}-prefix`,
        suffix: `${control}-suffix`,
    }
}

export function describedBy(
    ids: Ids,
    props: FieldProps & { prefix?: string; suffix?: string },
): string | undefined {
    const parts = [
        props.prefix !== undefined && ids.prefix,
        props.suffix !== undefined && ids.suffix,
        props.hint !== undefined && ids.hint,
        props.error !== undefined && ids.error,
        props.warning !== undefined && ids.warning,
    ].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : undefined
}

export function controlProps(ids: Ids, props: FieldProps & { prefix?: string; suffix?: string }) {
    return {
        id: ids.control,
        disabled: props.disabled,
        required: props.required,
        'aria-describedby': describedBy(ids, props),
        'aria-invalid': props.error !== undefined ? true : undefined,
    }
}

export function inputClass(props: FieldProps): string {
    return props.error !== undefined ? 'ui-input is-invalid' : 'ui-input'
}

export function root(props: Omit<RootProps, 'id'> & { id?: string }, ...classes: string[]) {
    const { id: _id, ...rest } = props
    return rootProps(rest, ...classes)
}

export function Messages({ ids, props }: { ids: Ids; props: FieldProps }) {
    return (
        <>
            {props.hint !== undefined && (
                <p className="ui-field__hint" id={ids.hint}>
                    {props.hint}
                </p>
            )}
            {props.error !== undefined && (
                <p className="ui-field__error" id={ids.error}>
                    <span className="ui-field__error-icon" aria-hidden="true">
                        !
                    </span>
                    {props.error}
                </p>
            )}
            {props.warning !== undefined && (
                <p className="ui-field__warning" id={ids.warning}>
                    <span className="ui-field__warning-icon" aria-hidden="true">
                        !
                    </span>
                    {props.warning}
                </p>
            )}
        </>
    )
}

export function LabelBadge({ badge }: { badge?: ReactNode }) {
    return badge ? <span className="ui-field__label-badge">{badge}</span> : null
}

export function FieldLabel({ ids, props }: { ids: Ids; props: FieldProps }) {
    return (
        <label
            className={props.hiddenLabel ? 'ui-field__label ui-visually-hidden' : 'ui-field__label'}
            id={ids.label}
            htmlFor={ids.control}
        >
            {props.label}
            {props.required && (
                <span className="ui-field__required" aria-hidden="true">
                    *
                </span>
            )}
            <LabelBadge badge={props.labelBadge} />
        </label>
    )
}

/** A labeled field with its messages under the control. */
export function Labeled({
    ids,
    props,
    children,
}: {
    ids: Ids
    props: FieldProps
    children: ReactNode
}) {
    return (
        <div {...root(props, 'ui-field')}>
            <FieldLabel ids={ids} props={props} />
            {children}
            <Messages ids={ids} props={props} />
        </div>
    )
}
