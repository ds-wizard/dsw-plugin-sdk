export function getApiUrlAndToken(localStorageKey: string = 'session/app'): {
    apiUrl: string
    token: string | null
} {
    const sessionString = localStorage.getItem(localStorageKey)
    const session = sessionString ? JSON.parse(sessionString) : null

    const apiUrlBase = session?.apiUrlBase || ''
    const token = session?.token?.token || null

    return { apiUrl: apiUrlBase + '/wizard-api', token }
}
