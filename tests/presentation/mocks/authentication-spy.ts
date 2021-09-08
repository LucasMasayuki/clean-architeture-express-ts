import { Authentication } from '@/domain/usecases/authentication'
import { Params, Result } from '@/types/authentication'
import faker from 'faker'

export default class AuthenticationSpy implements Authentication {
    params: Params

    result: Result | null = {
        accessToken: faker.datatype.uuid(),
        name: faker.name.firstName(),
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
