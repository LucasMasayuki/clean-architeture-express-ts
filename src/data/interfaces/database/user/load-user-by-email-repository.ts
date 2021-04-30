export type LoadUserByEmailRepositoryResult = {
    id: string
    firstName: string
    lastName: string
    password: string
}

export interface LoadUserByEmailRepository {
    loadByEmail: (email: string) => Promise<LoadUserByEmailRepositoryResult | null>
}
