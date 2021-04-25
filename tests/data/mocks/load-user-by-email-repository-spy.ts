import {
    LoadUserByEmailRepository,
    LoadUserByEmailRepositoryResult,
} from '@/data/interfaces/database/user/load-user-by-email-repository'
import faker from '@/tests/helpers/faker'

export default class LoadUserByEmailRepositorySpy implements LoadUserByEmailRepository {
    email: string

    result: LoadUserByEmailRepositoryResult | null = {
        id: faker.uuid,
        name: faker.name,
        password: faker.password,
    }

    constructor(email = '') {
        this.email = email
    }

    async loadByEmail(email: string): Promise<LoadUserByEmailRepositoryResult | null> {
        this.email = email

        return this.result
    }
}
