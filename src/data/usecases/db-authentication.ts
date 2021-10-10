import { Authentication, AuthenticationParams, AuthenticationResult } from '@/domain/usecases/authentication'
import { Encrypter, HashComparer } from '../interfaces/cryptography'
import env from '@/main/config/env'
import { LoadUserByEmailRepository } from '../interfaces/database/user/load-user-by-email-repository'

export default class DbAuthentication implements Authentication {
  constructor (
    private readonly userRepository: LoadUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {
  }

  async auth (authenticationParams: AuthenticationParams): Promise<AuthenticationResult | null> {
    const user = await this.userRepository.loadByEmail(authenticationParams.email)

    if (user != null) {
      const isValid = await this.hashComparer.compare(authenticationParams.password, user.password)

      if (isValid) {
        const accessToken = await this.encrypter.encrypt(user.id.toString())

        return {
          accessToken,
          typeOfToken: 'bearer',
          expiratesIn: new Date().getTime() - env.jwtExpirationIn
        }
      }
    }

    return null
  }
}
