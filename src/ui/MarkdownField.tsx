import { createElement } from 'react'

import { describedBy, FieldProps, Labeled, useIds } from './internal/field'
import { flag, useHostValue } from './internal/host-element'
import { useUiWords } from './Words'

export type MarkdownFieldProps = FieldProps & {
    /** Markdown. */
    value: string
    onChange: (value: string) => void
}

/**
 * Text with formatting, edited as formatted text or as Markdown. Drawn by the
 * app's own editor, so it behaves as every Markdown field in the wizard does.
 */
export function MarkdownField({ value, onChange, ...props }: MarkdownFieldProps) {
    const ids = useIds(props.id)
    const words = useUiWords()
    const ref = useHostValue<HTMLElement>('editorValue', 'editorChanged', value, onChange)
    const { toolbar, ...rest } = words.markdown
    return (
        <Labeled ids={ids} props={props}>
            {createElement('ui-markdown-editor', {
                ref,
                'input-id': ids.control,
                labelledby: ids.label,
                label: props.label,
                words: JSON.stringify({ ...rest, toolbar: toolbar(props.label) }),
                describedby: describedBy(ids, props),
                invalid: flag(props.error !== undefined),
                disabled: flag(props.disabled),
                required: flag(props.required),
            })}
        </Labeled>
    )
}
