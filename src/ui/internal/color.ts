// The color arithmetic `Ui.ItemIcon` uses, so an item has the same color in
// a plugin as in the app (`Ui.Theme.Oklch`, `Ui.Theme.Palette.toHex`).

type Rgb = { r: number; g: number; b: number }

function toLinearRgb(l: number, c: number, h: number): Rgb {
    const rad = (h * Math.PI) / 180
    const a = c * Math.cos(rad)
    const b = c * Math.sin(rad)
    const lCone = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
    const mCone = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
    const sCone = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
    return {
        r: 4.0767416621 * lCone - 3.3077115913 * mCone + 0.2309699292 * sCone,
        g: -1.2684380046 * lCone + 2.6097574011 * mCone - 0.3413193965 * sCone,
        b: -0.0041960863 * lCone - 0.7034186147 * mCone + 1.707614701 * sCone,
    }
}

function inGamut(l: number, c: number, h: number): boolean {
    const linear = toLinearRgb(l, c, h)
    const ok = (value: number) => value >= -0.000001 && value <= 1.000001
    return ok(linear.r) && ok(linear.g) && ok(linear.b)
}

function gamutChroma(l: number, c: number, h: number): number {
    if (inGamut(l, c, h)) return c
    let low = 0
    let high = c
    for (let step = 0; step < 50; step++) {
        const mid = (low + high) / 2
        if (inGamut(l, mid, h)) low = mid
        else high = mid
    }
    return low
}

function linearToSrgb(value: number): number {
    const clamped = Math.min(1, Math.max(0, value))
    return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055
}

function srgbToLinear(value: number): number {
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

function toHex({ r, g, b }: Rgb): string {
    const part = (value: number) =>
        Math.round(value * 255)
            .toString(16)
            .padStart(2, '0')
    return `#${part(r)}${part(g)}${part(b)}`
}

/** An OKLCH color as `#rrggbb`, its chroma reduced until sRGB can show it. */
export function oklchToHex(l: number, c: number, h: number): string {
    const linear = toLinearRgb(l, gamutChroma(l, c, h), h)
    return toHex({
        r: linearToSrgb(linear.r),
        g: linearToSrgb(linear.g),
        b: linearToSrgb(linear.b),
    })
}

function parseHex(hex: string): Rgb | null {
    const digits = hex.trim().replace(/^#/, '')
    const full =
        digits.length === 3
            ? digits
                  .split('')
                  .map((d) => d + d)
                  .join('')
            : digits.slice(0, 6)
    if (!/^[0-9a-fA-F]{6}$/.test(full)) return null
    const value = (index: number) => parseInt(full.slice(index, index + 2), 16) / 255
    return { r: value(0), g: value(2), b: value(4) }
}

function luminance({ r, g, b }: Rgb): number {
    return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
}

function contrast(a: Rgb, b: Rgb): number {
    const la = luminance(a)
    const lb = luminance(b)
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** White or near-black, whichever reads better on `background`. */
export function inkOn(background: string): string | undefined {
    const color = parseHex(background)
    if (!color) return undefined
    const white = { r: 1, g: 1, b: 1 }
    const dark = { r: 17 / 255, g: 24 / 255, b: 39 / 255 }
    return contrast(white, color) >= contrast(dark, color) ? '#ffffff' : '#111827'
}
