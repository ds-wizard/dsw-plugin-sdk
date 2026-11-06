import { ReactNode } from 'react'

import { Icon } from './Icon'
import { RootProps, rootProps } from './internal/root'

export type AlertTone = 'info' | 'success' | 'warning' | 'danger' | 'private'

const TONES: Record<AlertTone, { modifier?: string; icon: string; assertive: boolean }> = {
    info: { icon: 'fa-circle-info', assertive: false },
    success: { modifier: 'ui-alert--success', icon: 'fa-circle-check', assertive: false },
    warning: { modifier: 'ui-alert--warning', icon: 'fa-triangle-exclamation', assertive: true },
    danger: { modifier: 'ui-alert--danger', icon: 'fa-circle-exclamation', assertive: true },
    private: { modifier: 'ui-alert--private', icon: 'fa-lock', assertive: false },
}

export type AlertProps = RootProps & {
    tone?: AlertTone
    /** Another icon than the tone's. */
    icon?: string
    children: ReactNode
}

/**
 * A message about a region of the page. The tone is carried by an icon and a
 * border as well as by color; a warning and a danger are announced at once
 * (`role="alert"`), the others politely (`role="status"`).
 */
export function Alert({ tone = 'info', icon, children, ...props }: AlertProps) {
    const config = TONES[tone]
    return (
        <div
            role={config.assertive ? 'alert' : 'status'}
            {...rootProps(props, 'ui-alert', config.modifier)}
        >
            <div className="ui-alert__icon">
                <Icon name={icon ?? config.icon} />
            </div>
            <div className="ui-alert__content">{children}</div>
        </div>
    )
}
