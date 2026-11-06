import { RootProps, rootProps } from './internal/root'

const WEIGHTS: Record<string, string> = {
    fas: 'fas',
    'fa-solid': 'fas',
    fa: 'fas',
    far: 'far',
    'fa-regular': 'far',
    fab: 'fab',
    'fa-brands': 'fab',
}

/**
 * Font Awesome classes as the design system writes them: `"fa-plus"`,
 * `"fas fa-plus"`, `"fa-solid fa-plus"` and `"far fa-file-pdf"` are all
 * understood, the weight is kept (solid when none is given), and a name with
 * no glyph is a question mark.
 */
export function iconClass(name: string): string {
    const tokens = name.split(/\s+/).filter(Boolean)
    const glyphs = tokens.filter((token) => token.startsWith('fa-') && !(token in WEIGHTS))
    if (glyphs.length === 0) return 'fas fa-question'
    const weight = tokens.map((token) => WEIGHTS[token]).find(Boolean) ?? 'fas'
    return [weight, ...glyphs].join(' ')
}

export type IconProps = RootProps & {
    /** Font Awesome classes, such as `"fa-plus"` or `"far fa-file-pdf"`. */
    name: string
    /** Says what the icon means; without it the icon is decorative and hidden from assistive technology. */
    label?: string
    spin?: boolean
}

export function Icon({ name, label, spin, ...props }: IconProps) {
    const accessibility = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }
    return (
        <i
            {...accessibility}
            {...rootProps(props, 'ui-icon', iconClass(name), spin && 'ui-spinner')}
        />
    )
}

/** The spinner the design system uses for anything in progress. */
export function Spinner(props: RootProps & { label?: string }) {
    return <Icon name="fas fa-circle-notch" spin {...props} />
}
