import { ReactNode } from 'react'

export type FlashProps = {
    children: ReactNode
}

export function FlashSuccess(props: FlashProps) {
    return <Flash {...props} className="alert-success" icon="fas fa-check" />
}

export function FlashError(props: FlashProps) {
    return <Flash {...props} className="alert-danger" icon="fas fa-exclamation-circle" />
}

export function FlashWarning(props: FlashProps) {
    return <Flash {...props} className="alert-warning" icon="fas fa-exclamation-triangle" />
}

export function FlashInfo(props: FlashProps) {
    return <Flash {...props} className="alert-info" icon="fas fa-info-circle" />
}

export function FlashTip(props: FlashProps) {
    return <Flash {...props} className="alert-info" icon="fas fa-lightbulb" />
}

export function FlashLoader() {
    return (
        <Flash className="alert-inline-loader" icon="fas fa-spinner fa-spin">
            Loading...
        </Flash>
    )
}

type GenericFlashProps = FlashProps & {
    className: string
    icon: string
}

function Flash({ children, className, icon }: GenericFlashProps) {
    return (
        <div className={`alert d-flex align-items-baseline ${className}`} role="alert">
            <i className={`${icon} me-2`}></i> {children}
        </div>
    )
}
