// The session the app keeps in local storage: the API it talks to, which is
// the one API for everything (`…/api`), and the signed-in user's token.
export function getApiUrlAndToken(localStorageKey: string = 'session'): {
    apiUrl: string
    token: string | null
} {
    const sessionString = localStorage.getItem(localStorageKey)
    const session = sessionString ? JSON.parse(sessionString) : null

    const apiUrl = session?.apiUrl || ''
    const token = session?.token?.token || null

    return { apiUrl, token }
}
