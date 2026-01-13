export function createUUID(): string {
    // Works in modern browsers and Node 19+ (and many earlier Node versions depending on globals)
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID()
    }

    // Fallback if randomUUID isn't available:
    let dt = Date.now()
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = ((dt + Math.random() * 16) % 16) | 0
        dt = Math.floor(dt / 16)
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
}
