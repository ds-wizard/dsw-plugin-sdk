import { DragEvent, useId, useRef, useState } from 'react'

import { Icon } from './Icon'
import { RootProps, rootProps } from './internal/root'
import { useUiWords } from './Words'

export type FileUploadProps = Omit<RootProps, 'id'> & {
    /** The field's id; generated when not given. */
    id?: string
    label: string
    /** The file chosen, or `null`. */
    file: File | null
    /** A file was chosen or dropped; `others` are the rest when several were. */
    onChange: (file: File, others: File[]) => void
    /** Clears the choice; without it the chosen file cannot be removed. */
    onClear?: () => void
    /** What can be chosen, as the input's `accept`: `".json"`, `"application/json"`. */
    accept?: string
    multiple?: boolean
    /** The button's label; "Choose a file" unless told otherwise. */
    buttonLabel?: string
    /** Beside the button; "or drop it here" unless told otherwise. */
    hint?: string
    error?: string
    /** How many files were chosen, when several were. */
    count?: number
}

/** Choosing a file, by a button or by dropping one. */
export function FileUpload({
    label,
    file,
    onChange,
    onClear,
    accept,
    multiple,
    buttonLabel,
    hint,
    error,
    count = 1,
    ...props
}: FileUploadProps) {
    const words = useUiWords()
    const generated = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const { id: givenId, ...root } = props
    const id = givenId ?? `ui-file-upload-${generated}`
    const ids = {
        label: `${id}-label`,
        button: `${id}-button`,
        hint: `${id}-hint`,
        error: `${id}-error`,
    }
    const input = useRef<HTMLInputElement>(null)
    const [hover, setHover] = useState(false)

    const choose = (files: FileList | null) => {
        const list = files ? Array.from(files) : []
        if (list.length > 0) onChange(list[0], list.slice(1))
    }
    const onDrag = (entered: boolean) => (event: DragEvent) => {
        event.preventDefault()
        setHover(entered)
    }

    return (
        <div {...rootProps(root, 'ui-field')}>
            <label className="ui-field__label" id={ids.label} htmlFor={ids.button}>
                {label}
            </label>
            <input
                ref={input}
                type="file"
                hidden
                accept={accept}
                multiple={multiple}
                onChange={(event) => {
                    choose(event.target.files)
                    event.target.value = ''
                }}
            />
            {file ? (
                <div className="ui-file-upload ui-file-upload--chosen">
                    <span className="ui-file-upload__icon" aria-hidden="true">
                        <Icon name="fa-file" />
                    </span>
                    <p className="ui-file-upload__name" role="status">
                        {words.fileChosen(file.name, count - 1)}
                    </p>
                    {onClear && (
                        <button
                            type="button"
                            className="ui-button ui-button--secondary ui-button--icon"
                            aria-label={words.remove(file.name)}
                            aria-describedby={error !== undefined ? ids.error : undefined}
                            onClick={onClear}
                        >
                            <Icon name="fa-xmark" />
                        </button>
                    )}
                </div>
            ) : (
                <div
                    className={[
                        'ui-file-upload',
                        hover && 'is-hovered',
                        error !== undefined && 'is-invalid',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    onDragEnter={onDrag(true)}
                    onDragOver={onDrag(true)}
                    onDragLeave={onDrag(false)}
                    onDrop={(event) => {
                        event.preventDefault()
                        setHover(false)
                        choose(event.dataTransfer.files)
                    }}
                >
                    <span className="ui-file-upload__icon" aria-hidden="true">
                        <Icon name="fa-file-arrow-up" />
                    </span>
                    <button
                        type="button"
                        id={ids.button}
                        className="ui-button ui-button--secondary"
                        aria-labelledby={`${ids.label} ${ids.button}`}
                        aria-describedby={[ids.hint, error !== undefined && ids.error]
                            .filter(Boolean)
                            .join(' ')}
                        onClick={() => input.current?.click()}
                    >
                        <span>{buttonLabel ?? words.fileUploadButton}</span>
                    </button>
                    <p className="ui-file-upload__hint" id={ids.hint}>
                        {hint ?? words.fileUploadHint}
                    </p>
                </div>
            )}
            {error !== undefined && (
                <p className="ui-field__error" id={ids.error}>
                    <span className="ui-field__error-icon" aria-hidden="true">
                        !
                    </span>
                    {error}
                </p>
            )}
        </div>
    )
}
