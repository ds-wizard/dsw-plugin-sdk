import { ReactNode } from 'react'

import { RootProps, rootProps } from './internal/root'

export type TooltipPlacement = 'above' | 'below' | 'start' | 'end' | 'trailing'

const PLACEMENTS: Record<TooltipPlacement, string> = {
    above: 'ui-tooltip__bubble--above',
    below: 'ui-tooltip__bubble--below',
    start: 'ui-tooltip__bubble--start',
    end: 'ui-tooltip__bubble--end',
    trailing: 'ui-tooltip__bubble--trailing',
}

export type TooltipProps = RootProps & {
    label: string
    placement?: TooltipPlacement
    /**
     * The tooltip's id, for a trigger that names it in `aria-describedby`:
     * the tooltip is then read out with the trigger. Without it the tooltip is
     * for the eye only, so the trigger has to say the same in its own name.
     */
    bubbleId?: string
    /** The trigger: something focusable, so the tooltip opens from the keyboard too. */
    children: ReactNode
}

/**
 * A tooltip that opens on hover and on focus. Escape hides it, through the
 * app's own handler.
 */
export function Tooltip({
    label,
    placement = 'below',
    bubbleId,
    children,
    ...props
}: TooltipProps) {
    return (
        <span {...rootProps(props, 'ui-tooltip')}>
            {children}
            <span
                role="tooltip"
                id={bubbleId}
                aria-hidden={bubbleId ? undefined : true}
                className={`ui-tooltip__bubble ${PLACEMENTS[placement]}`}
            >
                {label}
            </span>
        </span>
    )
}
