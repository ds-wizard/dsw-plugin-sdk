import { CSSProperties, ReactNode, useState } from 'react'

import { Icon } from './Icon'
import {
    controlProps,
    describedBy,
    FieldProps,
    Ids,
    inputClass,
    LabelBadge,
    Labeled,
    Messages,
    root,
    useIds,
} from './internal/field'
import { RootProps } from './internal/root'
import { useUiWords } from './Words'

/*
 * Form fields. Each builds its own label, control, hint and error and ties
 * them together — `for`, `aria-describedby`, `aria-invalid` — so none of that
 * can be forgotten. The value is the caller's (controlled): the field shows
 * `value` and reports a change with `onChange`.
 *
 * `id` is the control's (generated when not given); `className`, `style`,
 * `aria-*` and `data-*` go on the field's root.
 */

export type { FieldProps }

type Affixes = {
    /** Text before the control, such as a currency. */
    prefix?: string
    /** Text after the control, such as a unit. */
    suffix?: string
    /** Font Awesome classes of an icon after the control. */
    suffixIcon?: string
}

function Affixed({ ids, props, children }: { ids: Ids; props: Affixes; children: ReactNode }) {
    if (
        props.prefix === undefined &&
        props.suffix === undefined &&
        props.suffixIcon === undefined
    ) {
        return <>{children}</>
    }
    return (
        <div className="ui-field__affixed">
            {props.prefix !== undefined && (
                <span className="ui-field__affix" id={ids.prefix}>
                    {props.prefix}
                </span>
            )}
            {children}
            {props.suffix !== undefined && (
                <span className="ui-field__affix" id={ids.suffix}>
                    {props.suffix}
                </span>
            )}
            {props.suffixIcon !== undefined && (
                <span className="ui-field__affix ui-field__affix--icon" aria-hidden="true">
                    <Icon name={props.suffixIcon} />
                </span>
            )}
        </div>
    )
}

// TEXT

export type TextFieldProps = FieldProps &
    Affixes & {
        value: string
        onChange: (value: string) => void
        type?: 'text' | 'email' | 'url' | 'tel' | 'search' | 'number'
        placeholder?: string
        autoComplete?: string
        inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
        onBlur?: () => void
    }

export function TextField({
    value,
    onChange,
    type = 'text',
    placeholder,
    autoComplete,
    inputMode,
    onBlur,
    ...props
}: TextFieldProps) {
    const ids = useIds(props.id)
    return (
        <Labeled ids={ids} props={props}>
            <Affixed ids={ids} props={props}>
                <input
                    type={type}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    inputMode={inputMode}
                    className={inputClass(props)}
                    {...controlProps(ids, props)}
                />
            </Affixed>
        </Labeled>
    )
}

export type TextareaFieldProps = FieldProps & {
    value: string
    onChange: (value: string) => void
    /** How many lines it shows; it grows with its content otherwise. */
    rows?: number
    placeholder?: string
    onBlur?: () => void
}

export function TextareaField({
    value,
    onChange,
    rows,
    placeholder,
    onBlur,
    ...props
}: TextareaFieldProps) {
    const ids = useIds(props.id)
    return (
        <Labeled ids={ids} props={props}>
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onBlur={onBlur}
                rows={rows}
                placeholder={placeholder}
                className={`${inputClass(props)} ui-input--multiline${rows ? ' ui-input--rows' : ''}`}
                {...controlProps(ids, props)}
            />
        </Labeled>
    )
}

export type SelectOption = { value: string; label: string }

export type SelectFieldProps = FieldProps & {
    value: string
    onChange: (value: string) => void
    options: SelectOption[]
    /** Options under a heading each, after the `options`. */
    groups?: { label: string; options: SelectOption[] }[]
}

export function SelectField({ value, onChange, options, groups = [], ...props }: SelectFieldProps) {
    const ids = useIds(props.id)
    const option = (entry: SelectOption) => (
        <option key={entry.value} value={entry.value}>
            {entry.label}
        </option>
    )
    return (
        <Labeled ids={ids} props={props}>
            <span className="ui-select">
                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className={inputClass(props)}
                    {...controlProps(ids, props)}
                >
                    {options.map(option)}
                    {groups.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                            {group.options.map(option)}
                        </optgroup>
                    ))}
                </select>
            </span>
        </Labeled>
    )
}

export type PasswordFieldProps = FieldProps & {
    value: string
    onChange: (value: string) => void
    autoComplete?: 'current-password' | 'new-password' | 'off'
}

export function PasswordField({ value, onChange, autoComplete, ...props }: PasswordFieldProps) {
    const ids = useIds(props.id)
    return (
        <Labeled ids={ids} props={props}>
            <div className="ui-field__stack">
                <input
                    type="password"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    autoComplete={autoComplete}
                    className={inputClass(props)}
                    {...controlProps(ids, props)}
                />
            </div>
        </Labeled>
    )
}

export type SecretFieldProps = FieldProps & {
    value: string
    onChange: (value: string) => void
}

/** A token, a key: hidden as it is typed, with a button that shows it. */
export function SecretField({ value, onChange, ...props }: SecretFieldProps) {
    const ids = useIds(props.id)
    const words = useUiWords()
    const [revealed, setRevealed] = useState(false)
    return (
        <Labeled ids={ids} props={props}>
            <div className="ui-field__affixed">
                <input
                    type={revealed ? 'text' : 'password'}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    autoComplete="off"
                    className={inputClass(props)}
                    {...controlProps(ids, props)}
                />
                <button
                    type="button"
                    className="ui-field__reveal"
                    disabled={props.disabled}
                    aria-pressed={revealed}
                    aria-label={words.show(props.label)}
                    onClick={() => setRevealed(!revealed)}
                >
                    <Icon name={revealed ? 'fa-eye-slash' : 'fa-eye'} />
                </button>
            </div>
        </Labeled>
    )
}

export type ReadOnlyFieldProps = Omit<FieldProps, 'required' | 'disabled' | 'error' | 'warning'> & {
    children: ReactNode
}

/** A value shown where a field would be, labeled as one. */
export function ReadOnlyField({ children, ...props }: ReadOnlyFieldProps) {
    const ids = useIds(props.id)
    return (
        <Labeled ids={ids} props={props}>
            <p
                className="ui-field__static"
                id={ids.control}
                aria-describedby={describedBy(ids, props)}
            >
                {children}
            </p>
        </Labeled>
    )
}

// ONE BOX

export type CheckboxFieldProps = FieldProps & {
    checked: boolean
    onChange: (checked: boolean) => void
}

/** One box, its label beside it. */
export function CheckboxField({ checked, onChange, ...props }: CheckboxFieldProps) {
    const ids = useIds(props.id)
    return (
        <div {...root(props, 'ui-field')}>
            <label className="ui-field__check" htmlFor={ids.control}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                    className={inputClass(props)}
                    {...controlProps(ids, props)}
                />
                <span className="ui-field__check-label">
                    {props.label}
                    <LabelBadge badge={props.labelBadge} />
                </span>
            </label>
            <Messages ids={ids} props={props} />
        </div>
    )
}

/** A switch: something that is on or off and takes effect as such. */
export function ToggleField({ checked, onChange, ...props }: CheckboxFieldProps) {
    const ids = useIds(props.id)
    return (
        <div {...root(props, 'ui-field')}>
            <label className="ui-field__check ui-field__check--switch" htmlFor={ids.control}>
                <input
                    type="checkbox"
                    role="switch"
                    checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                    className={props.error !== undefined ? 'ui-switch is-invalid' : 'ui-switch'}
                    {...controlProps(ids, props)}
                />
                <span className="ui-field__check-label">
                    {props.label}
                    <LabelBadge badge={props.labelBadge} />
                </span>
            </label>
            <Messages ids={ids} props={props} />
        </div>
    )
}

// CHOICES

export type Choice = {
    value: string
    label: string
    /** A sentence under the label, inside the option. */
    description?: string
    icon?: string
    /** A swatch of this color before the label. */
    color?: string
    badge?: string
    tone?: 'info' | 'warning' | 'danger'
}

type ChoicesProps = FieldProps & {
    options: Choice[]
    /** The options side by side rather than one under another. */
    inline?: boolean
}

export type RadioGroupProps = ChoicesProps & {
    value: string
    onChange: (value: string) => void
}

export type CheckboxGroupProps = ChoicesProps & {
    values: string[]
    onChange: (values: string[]) => void
}

const CHOICE_TONES = {
    info: 'ui-choice--info',
    warning: 'ui-choice--warning',
    danger: 'ui-choice--danger',
}

function ChoiceOption({
    type,
    name,
    choice,
    checked,
    disabled,
    onPick,
}: {
    type: 'radio' | 'checkbox'
    name: string
    choice: Choice
    checked: boolean
    disabled?: boolean
    onPick: () => void
}) {
    const classes = [
        'ui-choice',
        checked && 'is-selected',
        choice.tone && CHOICE_TONES[choice.tone],
    ].filter(Boolean)
    return (
        <label className={classes.join(' ')}>
            <input
                type={type}
                name={name}
                value={choice.value}
                checked={checked}
                disabled={disabled}
                className="ui-choice__input"
                onChange={onPick}
            />
            <span className="ui-choice__body">
                <span className="ui-choice__label">
                    {choice.color && (
                        <span
                            className="ui-choice__color"
                            aria-hidden="true"
                            style={{ background: choice.color }}
                        />
                    )}
                    {choice.icon && (
                        <span className="ui-choice__icon">
                            <Icon name={choice.icon} />
                        </span>
                    )}
                    {choice.label}
                    {choice.badge && <span className="ui-badge">{choice.badge}</span>}
                </span>
                {choice.description && (
                    <span className="ui-choice__description">{choice.description}</span>
                )}
            </span>
        </label>
    )
}

function Choices({ ids, props, children }: { ids: Ids; props: ChoicesProps; children: ReactNode }) {
    return (
        <fieldset
            {...root(props, 'ui-field', 'ui-field--group', 'ui-field--choices')}
            id={ids.control}
            aria-describedby={describedBy(ids, props)}
        >
            <legend
                className={
                    props.hiddenLabel ? 'ui-field__legend ui-visually-hidden' : 'ui-field__legend'
                }
                id={ids.label}
            >
                {props.label}
                {props.required && (
                    <span className="ui-field__required" aria-hidden="true">
                        *
                    </span>
                )}
            </legend>
            <div
                className={props.inline ? 'ui-choices ui-choices--inline' : 'ui-choices'}
                style={
                    props.inline
                        ? ({ '--ui-choices-count': String(props.options.length) } as CSSProperties)
                        : undefined
                }
            >
                {children}
            </div>
            <Messages ids={ids} props={props} />
        </fieldset>
    )
}

/** One of several, each option with its label and description inside it. */
export function RadioGroup({ value, onChange, ...props }: RadioGroupProps) {
    const ids = useIds(props.id)
    return (
        <Choices ids={ids} props={props}>
            {props.options.map((choice) => (
                <ChoiceOption
                    key={choice.value}
                    type="radio"
                    name={ids.control}
                    choice={choice}
                    checked={choice.value === value}
                    disabled={props.disabled}
                    onPick={() => onChange(choice.value)}
                />
            ))}
        </Choices>
    )
}

/** Any of several. `onChange` gets the values checked, in the options' order. */
export function CheckboxGroup({ values, onChange, ...props }: CheckboxGroupProps) {
    const ids = useIds(props.id)
    const toggle = (value: string) => {
        const next = values.includes(value) ? values.filter((v) => v !== value) : [...values, value]
        onChange(props.options.map((o) => o.value).filter((v) => next.includes(v)))
    }
    return (
        <Choices ids={ids} props={props}>
            {props.options.map((choice) => (
                <ChoiceOption
                    key={choice.value}
                    type="checkbox"
                    name={ids.control}
                    choice={choice}
                    checked={values.includes(choice.value)}
                    disabled={props.disabled}
                    onPick={() => toggle(choice.value)}
                />
            ))}
        </Choices>
    )
}

// GROUP

export type FieldGroupProps = Omit<RootProps, 'id'> & {
    id?: string
    /** The group's name. */
    legend: string
    /** The fields one under another rather than side by side. */
    stacked?: boolean
    /** A control beside the legend. */
    headerAction?: ReactNode
    hint?: ReactNode
    error?: string
    children: ReactNode
}

/** Settings that belong together, in a `fieldset` named by its legend. */
export function FieldGroup({
    legend,
    stacked,
    headerAction,
    hint,
    error,
    children,
    ...props
}: FieldGroupProps) {
    const ids = useIds(props.id)
    const described = [hint !== undefined && ids.hint, error !== undefined && ids.error].filter(
        Boolean,
    )
    const legendElement = (
        <legend className="ui-field__legend" id={ids.label}>
            {legend}
        </legend>
    )
    return (
        <fieldset
            {...root(props, 'ui-field', 'ui-field--group', error !== undefined ? 'is-invalid' : '')}
            id={ids.control}
            aria-labelledby={ids.label}
            aria-describedby={described.length > 0 ? described.join(' ') : undefined}
        >
            {headerAction ? (
                <div className="ui-field__group-header">
                    {legendElement}
                    {headerAction}
                </div>
            ) : (
                legendElement
            )}
            <div
                className={
                    stacked
                        ? 'ui-field__group-fields ui-field__group-fields--stacked'
                        : 'ui-field__group-fields'
                }
            >
                {children}
            </div>
            <Messages ids={ids} props={{ label: legend, hint, error }} />
        </fieldset>
    )
}
