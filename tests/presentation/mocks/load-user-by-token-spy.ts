import { LoadUserByToken, LoadUserByTokenResult } from '@/domain/usecases/load-user-by-token'
import faker from '@/tests/helpers/faker'

type Result = {
    id: string
}

export default class LoadUserByTokenSpy implements LoadUserByToken {
    accessToken: string

    result: Result | null

    constructor() {
        this.accessToken = ''
        this.result = {
            id: faker.uuid,
        }
    }

    async load(accessToken: string): Promise<LoadUserByTokenResult | null> {
        this.accessToken = accessToken
        return this.result
    }
}
