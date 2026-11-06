import { createElement } from 'react'

import { describedBy, FieldProps, Labeled, useIds } from './internal/field'
import { flag, useHostValue } from './internal/host-element'
import { useUiWords } from './Words'

export type DateFieldProps = FieldProps & {
    /**
     * The value as a machine reads it, `""` when empty: a date is
     * `2026-09-11`, a time `14:30`, a date and time an ISO-8601 instant with
     * its zone (shown in the browser's).
     */
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

type Mode = 'date' | 'datetime' | 'time'

function MomentField(mode: Mode, { value, onChange, placeholder, ...props }: DateFieldProps) {
    const ids = useIds(props.id)
    const words = useUiWords()
    const ref = useHostValue<HTMLElement>('pickerValue', 'uiDatePickerChanged', value, onChange)
    return (
        <Labeled ids={ids} props={props}>
            {createElement('ui-date-picker', {
                ref,
                mode,
                'input-id': ids.control,
                label: props.label.toLowerCase(),
                words: JSON.stringify({
                    clear: words.clearDate(props.label),
                    invalidValue: words.invalidDate,
                }),
                describedby: describedBy(ids, props),
                invalid: flag(props.error !== undefined),
                disabled: flag(props.disabled),
                required: flag(props.required),
                placeholder,
            })}
        </Labeled>
    )
}

/**
 * A calendar date, typed or picked. Drawn by the app's own date picker, so it
 * behaves as every date field in the wizard does.
 */
export function DateField(props: DateFieldProps) {
    return MomentField('date', props)
}

/** A date and a time: an instant, in the browser's zone. */
export function DateTimeField(props: DateFieldProps) {
    return MomentField('datetime', props)
}

/** A time of day. */
export function TimeField(props: DateFieldProps) {
    return MomentField('time', props)
}
