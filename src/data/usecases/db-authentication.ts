import { Authentication } from '@/domain/usecases/authentication'
import { LoadUserByEmailRepository } from '@/data/interfaces/database/user/load-user-by-email-repository'
import { Params, Result } from '@/types/authentication'
import { Encrypter, HashComparer } from '../interfaces/cryptography'

export default class DbAuthentication implements Authentication {
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository

    private readonly hashComparer: HashComparer

    private readonly encrypter: Encrypter

    constructor(
        loadUserByEmailRepository: LoadUserByEmailRepository,
        hashComparer: HashComparer,
        encrypter: Encrypter,
    ) {
        this.loadUserByEmailRepository = loadUserByEmailRepository
        this.hashComparer = hashComparer
        this.encrypter = encrypter
    }

    async auth(authenticationParams: Params): Promise<Result | null> {
        const user = await this.loadUserByEmailRepository.loadByEmail(authenticationParams.email)

        if (user) {
            const isValid = await this.hashComparer.compare(authenticationParams.password, user.password)

            if (isValid) {
                const accessToken = await this.encrypter.encrypt(user.id)

                return {
                    accessToken,
                    name: user.name,
                }
            }
        }

        return null
    }
}
