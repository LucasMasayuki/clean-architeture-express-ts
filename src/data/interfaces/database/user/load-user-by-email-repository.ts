export type LoadUserByEmailRepositoryResult = {
    id: string
    name: string
    password: string
}

export interface LoadUserByEmailRepository {
    loadByEmail: (email: string) => Promise<LoadUserByEmailRepositoryResult | null>
}
