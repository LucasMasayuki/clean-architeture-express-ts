export type LoadUserByTokenResult = {
    id: string
}

export interface LoadUserByToken {
    load: (accessToken: string) => Promise<LoadUserByTokenResult | null>
}
