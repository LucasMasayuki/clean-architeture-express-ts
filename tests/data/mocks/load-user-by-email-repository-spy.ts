import { LoadUserByEmailRepository } from '@/data/interfaces/database/user/load-user-by-email-repository'
import { UserModel } from '@/domain/models/user'
import faker from 'faker'

export default class LoadUserByEmailRepositorySpy implements LoadUserByEmailRepository {
    email: string

    result: UserModel | null = {
        id: faker.datatype.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.firstName(),
        password: faker.random.words(),
        birthDate: faker.date.recent(),
        email: faker.internet.email(),
    }

    constructor(email = '') {
        this.email = email
    }

    async loadByEmail(email: string): Promise<UserModel | null> {
        this.email = email

        return this.result
    }
}
