import {
    CheckUserByEmailRepository,
    CheckUserByEmailRepositoryResult,
} from '@/data/interfaces/database/user/check-user-by-email-repository'

export default class CheckUserByEmailRepositorySpy implements CheckUserByEmailRepository {
    email = ''

    result = false

    async checkByEmail(email: string): Promise<CheckUserByEmailRepositoryResult> {
        this.email = email
        return this.result
    }
}
