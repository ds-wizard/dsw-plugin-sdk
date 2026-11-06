import { ReactNode } from 'react'

import { Alert } from './Alert'
import { Spinner } from './Icon'
import { RootProps, rootProps } from './internal/root'
import { Muted } from './Text'
import { useUiWords } from './Words'

export type AsyncBlockProps = RootProps & {
    loading: boolean
    /** Said in a danger alert in place of the content. */
    error?: ReactNode
    /** Said beside the spinner; "Loading…" unless told otherwise. */
    loadingLabel?: string
    children?: ReactNode
}

/**
 * Something that is fetched: a spinner and a polite announcement while it
 * loads, a danger alert if it fails, the content once it is there.
 */
export function AsyncBlock({ loading, error, loadingLabel, children, ...props }: AsyncBlockProps) {
    const words = useUiWords()
    if (loading) {
        return (
            <div
                role="status"
                aria-live="polite"
                {...rootProps(props, 'ui-async', 'ui-async--loading')}
            >
                <Spinner />
                <Muted>{loadingLabel ?? words.loading}</Muted>
            </div>
        )
    }
    if (error !== undefined && error !== null && error !== false) {
        return (
            <div {...rootProps(props, 'ui-async', 'ui-async--error')}>
                <Alert tone="danger">{error}</Alert>
            </div>
        )
    }
    return <div {...rootProps(props, 'ui-async')}>{children}</div>
}
