import { useEffect, useRef, useState } from 'react'

import { Icon } from './Icon'
import { RootProps, rootProps } from './internal/root'
import { Tooltip } from './Tooltip'
import { useUiWords } from './Words'

const CONFIRMATION_FOR = 2000

function write(value: string) {
    const legacy = () => {
        const input = document.createElement('textarea')
        input.style.cssText = 'position: absolute; left: -99999em'
        document.body.appendChild(input)
        input.value = value
        input.select()
        document.execCommand('copy')
        input.remove()
    }
    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(value).catch(legacy)
    } else {
        legacy()
    }
}

function useCopy(value: string): [boolean, () => void] {
    const [copied, setCopied] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
    useEffect(
        () => () => {
            if (timer.current) clearTimeout(timer.current)
        },
        [],
    )
    const copy = () => {
        write(value)
        setCopied(true)
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), CONFIRMATION_FOR)
    }
    return [copied, copy]
}

export type CopyProps = RootProps & {
    /** What is copied. */
    value: string
    /** The button's name: what it copies ("Copy the API key"). */
    label: string
    /**
     * `button` is the icon alone, `inline` the value with the button after it,
     * `brief` the icon with the first `chars` characters of the value.
     */
    variant?: 'button' | 'inline' | 'brief'
    chars?: number
}

/** Putting a value on the clipboard, and saying so. */
export function Copy({ value, label, variant = 'button', chars = 8, ...props }: CopyProps) {
    const words = useUiWords()
    const [copied, copy] = useCopy(value)
    const button = (
        <Tooltip label={copied ? words.copied : words.copyPrompt} placement="below">
            <button type="button" className="ui-copy__button" aria-label={label} onClick={copy}>
                <Icon name="fa-copy" />
                {variant === 'brief' && (
                    <small className="ui-copy__brief">{value.slice(0, chars)}</small>
                )}
            </button>
        </Tooltip>
    )
    const confirmation = (
        <span className="ui-copy__confirmation ui-visually-hidden" role="status">
            {copied ? words.copied : ''}
        </span>
    )
    if (variant === 'inline') {
        return (
            <div {...rootProps(props, 'ui-copy', 'ui-copy--inline')}>
                <code className="ui-copy__value">{value}</code>
                {button}
                {confirmation}
            </div>
        )
    }
    return (
        <span {...rootProps(props, 'ui-copy')}>
            {button}
            {confirmation}
        </span>
    )
}

/** A text button that copies, "Copy link" turning into "Copied". */
export function CopyTextButton({
    value,
    label,
    ...props
}: RootProps & { value: string; label: string }) {
    const words = useUiWords()
    const [copied, copy] = useCopy(value)
    return (
        <span {...rootProps(props, 'ui-copy')}>
            <button type="button" className="ui-copy__text-button" onClick={copy}>
                <Icon name={copied ? 'fa-check' : 'fa-link'} />
                <span className="ui-copy__text-button-label">{copied ? words.copied : label}</span>
            </button>
            <span className="ui-copy__confirmation ui-visually-hidden" role="status">
                {copied ? words.copied : ''}
            </span>
        </span>
    )
}
