import { UpdateAccessTokenRepository } from '@/data/interfaces/database/user/update-access-token-repository'

export default class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
    id: string

    token: string

    constructor() {
        this.id = ''
        this.token = ''
    }

    async updateAccessToken(id: string, token: string): Promise<void> {
        this.id = id
        this.token = token
    }
}
