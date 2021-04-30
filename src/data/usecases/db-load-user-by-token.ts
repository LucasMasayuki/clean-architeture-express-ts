import { LoadUserByToken } from '@/domain/usecases/load-user-by-token'
import { Decrypter } from '@/data/interfaces/cryptography'
import {
    LoadUserByTokenRepository,
    LoadUserByTokenRepositoryResult,
} from '@/data/interfaces/database/user/load-user-by-token-repository'

export default class DbLoadUserByToken implements LoadUserByToken {
    private readonly loadUserByTokenRepository: LoadUserByTokenRepository

    private readonly decrypter: Decrypter

    constructor(decrypter: Decrypter, loadUserByTokenRepository: LoadUserByTokenRepository) {
        this.decrypter = decrypter
        this.loadUserByTokenRepository = loadUserByTokenRepository
    }

    async load(accessToken: string): Promise<LoadUserByTokenRepositoryResult | null> {
        let token: string

        try {
            token = await this.decrypter.decrypt(accessToken)
        } catch (error) {
            return null
        }

        if (token) {
            const user = await this.loadUserByTokenRepository.loadByToken(accessToken)
            if (user) {
                return user
            }
        }

        return null
    }
}
