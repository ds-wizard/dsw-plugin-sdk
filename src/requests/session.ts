export function getApiUrlAndToken(localStorageKey: string = 'session/wizard'): {
    apiUrl: string
    token: string | null
} {
    const sessionString = localStorage.getItem(localStorageKey)
    const session = sessionString ? JSON.parse(sessionString) : null

    const apiUrl = session?.apiUrl || ''
    const token = session?.token?.token || null

    return { apiUrl, token }
}
