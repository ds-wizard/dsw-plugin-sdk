import { RootProps, rootProps } from './internal/root'
import { useUiWords } from './Words'

export type ProgressTone = 'brand' | 'success' | 'warning' | 'danger'

export type ProgressBarProps = RootProps & {
    /** What is measured; the bar's accessible name. */
    label: string
    value: number
    max: number
    tone?: ProgressTone
}

/**
 * How far along something is, with the value read out in words.
 * `towardsLimit` gives the tone the usage tables use.
 */
export function ProgressBar({ label, value, max, tone = 'brand', ...props }: ProgressBarProps) {
    const words = useUiWords()
    const filled = max <= 0 ? 0 : Math.min(1, Math.max(0, value / max))
    return (
        <div
            role="progressbar"
            aria-label={label}
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuetext={words.progressValue(value, max)}
            {...rootProps(props, 'ui-progress')}
        >
            <span
                className={`ui-progress__fill is-${tone}`}
                style={{ inlineSize: `${filled * 100}%` }}
            />
        </div>
    )
}

/** Fine until 80% of the limit, a warning up to it, and past it a problem. */
export function towardsLimit(value: number, max: number): ProgressTone {
    if (max <= 0) return 'brand'
    if (value >= max) return 'danger'
    if (value / max >= 0.8) return 'warning'
    return 'brand'
}
