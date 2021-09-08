import { UserModel } from '@/domain/models/user'
import { LoadUserByToken } from '@/domain/usecases/load-user-by-token'
import faker from 'faker'

export default class LoadUserByTokenSpy implements LoadUserByToken {
    accessToken: string

    result: UserModel | null

    constructor() {
        this.accessToken = ''
        this.result = {
            id: faker.datatype.uuid(),
            email: faker.internet.email(),
            birthDate: faker.date.recent(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: faker.internet.password(),
        }
    }

    async load(accessToken: string): Promise<UserModel | null> {
        this.accessToken = accessToken
        return this.result
    }
}
