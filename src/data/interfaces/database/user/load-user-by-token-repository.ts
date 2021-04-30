export type LoadUserByTokenRepositoryResult = {
    id: string
}

export interface LoadUserByTokenRepository {
    loadByToken: (token: string) => Promise<LoadUserByTokenRepositoryResult>
}
