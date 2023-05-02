import 'reflect-metadata'

import { Authentication, AuthenticationParams, AuthenticationResult } from '@/domain/usecases/authentication'
import { Encrypter, HashComparer } from '../interfaces/cryptography'
import env from '@/main/config/env'
import { LoadUserByEmailRepository } from '../interfaces/database/user/load-user-by-email-repository'
import { inject, injectable } from 'inversify'
import { LOAD_USER_BY_EMAIL_REPOSITORY_SYMBOL } from '@/main/ioc-containers/symbols/repositories'
import { ENCRYPTER_SYMBOL, HASH_COMPARER_SYMBOL } from '@/main/ioc-containers/symbols/cryptography/cryptography-symbols'

@injectable()
export default class DbAuthentication implements Authentication {
  constructor (
    @inject(LOAD_USER_BY_EMAIL_REPOSITORY_SYMBOL) private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
    @inject(HASH_COMPARER_SYMBOL) private readonly hashComparer: HashComparer,
    @inject(ENCRYPTER_SYMBOL) private readonly encrypter: Encrypter
  ) {
  }

  async auth (authenticationParams: AuthenticationParams): Promise<AuthenticationResult | null> {
    const user = await this.loadUserByEmailRepository.loadByEmail(authenticationParams.email)

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
