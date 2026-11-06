import { CSSProperties } from 'react'

import { Icon } from './Icon'
import { inkOn, oklchToHex } from './internal/color'
import { RootProps, rootProps } from './internal/root'

export type ItemIconProps = RootProps & {
    /** What the icon stands for; its first letter is the initials, its letters the color. */
    name: string
    /** A picture in place of the initials. */
    image?: string | null
    /** A small picture over the corner, such as an organization's logo. */
    imageOver?: string | null
    size?: 'small' | 'medium' | 'large'
    /** Up to two letters in place of the name's first. */
    initials?: string
    /** Font Awesome classes of a glyph in place of the initials. */
    icon?: string
    /** The background's hue, 0–360, in place of the one the name gives. */
    hue?: number
    /** A background color (`#rrggbb`); the letters take white or black, whichever reads. */
    color?: string
    square?: boolean
    /** No background color. */
    plain?: boolean
}

/** The hue the app gives a name: the sum of its code points, modulo 360. */
function hueOf(name: string): number {
    let sum = 0
    for (const char of name) sum += char.codePointAt(0) ?? 0
    return sum % 360
}

/**
 * The round icon of a user, a project or a knowledge model: a picture when
 * there is one, initials over a color the name decides otherwise — the same
 * color the app gives the same name. Decorative: say the name beside it.
 */
export function ItemIcon({
    name,
    image,
    imageOver,
    size = 'medium',
    initials,
    icon,
    hue,
    color,
    square,
    plain,
    ...props
}: ItemIconProps) {
    const classes = [
        'ui-item-icon',
        size === 'small' && 'ui-item-icon--sm',
        size === 'large' && 'ui-item-icon--lg',
        square && 'ui-item-icon--square',
        plain && 'ui-item-icon--plain',
    ]
    if (image) {
        return (
            <span {...rootProps(props, ...classes)}>
                <img src={image} alt="" />
            </span>
        )
    }
    const background: CSSProperties = plain
        ? {}
        : {
              backgroundColor:
                  color ??
                  (hue !== undefined
                      ? oklchToHex(0.88, 0.09, hue)
                      : oklchToHex(0.88, 0.06, hueOf(name))),
          }
    const ink: CSSProperties = color ? { color: inkOn(color) } : {}
    const root = rootProps(props, ...classes)
    return (
        <span aria-hidden="true" {...root} style={{ ...background, ...root.style }}>
            {icon ? (
                <span className="ui-item-icon__glyph" style={ink}>
                    <Icon name={icon} />
                </span>
            ) : (
                <span className="ui-item-icon__initials" style={ink}>
                    {initials ? initials.slice(0, 2).toUpperCase() : (Array.from(name)[0] ?? '')}
                </span>
            )}
            {imageOver && <img className="ui-item-icon__over" src={imageOver} alt="" />}
        </span>
    )
}
