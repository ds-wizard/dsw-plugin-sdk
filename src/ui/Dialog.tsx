import { FormEvent, ReactNode } from 'react'

import { RootProps, rootProps } from './internal/root'

/*
 * The parts of a dialog. A plugin's action opens in a dialog the app draws
 * with nothing in it — no title, no buttons — because what the action is
 * called and what it offers are the plugin's to say. These are what goes in
 * it, in this order:
 *
 *     <DialogHeader title="Send to the repository" />
 *     <DialogBody>…</DialogBody>
 *     <DialogFooter>
 *         <Button variant="ghost" onClick={onActionClose}>Cancel</Button>
 *         <Button variant="primary" onClick={send}>Send</Button>
 *     </DialogFooter>
 *
 * The way out comes first and the action last; alone, the way out is a
 * primary "Close", so Enter presses it. A dialog that is a form puts its body
 * and footer in a `DialogForm`, with a `SubmitButton` as the action, so Enter
 * sends it.
 */

export type DialogHeaderProps = RootProps & {
    title: ReactNode
    /** A control beside the title. */
    action?: ReactNode
}

/** The dialog's title, an `h2`: headings in its body start at `h3`. */
export function DialogHeader({ title, action, ...props }: DialogHeaderProps) {
    return (
        <div {...rootProps(props, 'ui-dialog__header')}>
            <h2 className="ui-subtitle">{title}</h2>
            {action}
        </div>
    )
}

export function DialogBody({ children, ...props }: RootProps & { children: ReactNode }) {
    return <div {...rootProps(props, 'ui-dialog__body')}>{children}</div>
}

/** The dialog's buttons: the way out first, the action last. */
export function DialogFooter({ children, ...props }: RootProps & { children: ReactNode }) {
    return <div {...rootProps(props, 'ui-dialog__footer')}>{children}</div>
}

export type DialogFormProps = RootProps & {
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    /** The `DialogBody` and the `DialogFooter`. */
    children: ReactNode
}

/** A dialog that is a form; the submit's default is prevented. */
export function DialogForm({ onSubmit, children, ...props }: DialogFormProps) {
    return (
        <form
            noValidate
            onSubmit={(event) => {
                event.preventDefault()
                onSubmit(event)
            }}
            {...rootProps(props, 'ui-dialog__form')}
        >
            {children}
        </form>
    )
}
