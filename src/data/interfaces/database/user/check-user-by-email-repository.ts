export type CheckUserByEmailRepositoryResult = boolean
export interface CheckUserByEmailRepository {
    checkByEmail: (email: string) => Promise<CheckUserByEmailRepositoryResult>
}
