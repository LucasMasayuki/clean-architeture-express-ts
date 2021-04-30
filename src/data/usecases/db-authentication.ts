import { Authentication } from '@/domain/usecases/authentication'
import { LoadUserByEmailRepository } from '@/data/interfaces/database/user/load-user-by-email-repository'
import { Params, Result } from '@/types/authentication'
import { Encrypter, HashComparer } from '../interfaces/cryptography'
import { UpdateAccessTokenRepository } from '../interfaces/database/user/update-access-token-repository'

export default class DbAuthentication implements Authentication {
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository

    private readonly hashComparer: HashComparer

    private readonly encrypter: Encrypter

    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

    constructor(
        loadUserByEmailRepository: LoadUserByEmailRepository,
        hashComparer: HashComparer,
        encrypter: Encrypter,
        updateAccessTokenRepository: UpdateAccessTokenRepository,
    ) {
        this.loadUserByEmailRepository = loadUserByEmailRepository
        this.hashComparer = hashComparer
        this.encrypter = encrypter
        this.updateAccessTokenRepository = updateAccessTokenRepository
    }

    async auth(authenticationParams: Params): Promise<Result | null> {
        const user = await this.loadUserByEmailRepository.loadByEmail(authenticationParams.email)

        if (user) {
            const isValid = await this.hashComparer.compare(authenticationParams.password, user.password)

            if (isValid) {
                const accessToken = await this.encrypter.encrypt(user.id)
                await this.updateAccessTokenRepository.updateAccessToken(user.id, accessToken)

                return {
                    accessToken,
                    name: `${user.firstName} ${user.lastName}`,
                }
            }
        }

        return null
    }
}
