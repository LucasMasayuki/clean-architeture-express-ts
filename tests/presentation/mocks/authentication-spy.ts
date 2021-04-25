import { Authentication } from '@/domain/usecases/authentication'
import faker from '@/tests/helpers/faker'
import { Params, Result } from '@/types/authentication'

export default class AuthenticationSpy implements Authentication {
    params: Params

    result: Result | null = {
        accessToken: faker.uuid,
        name: faker.name,
    }

    constructor() {
        this.params = {
            email: '',
            password: '',
        }
    }

    async auth(params: Params): Promise<Result | null> {
        this.params = params
        return this.result
    }
}
