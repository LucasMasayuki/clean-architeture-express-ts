import { LoadUserByToken } from '@/domain/usecases/load-user-by-token'
import { Decrypter } from '@/data/interfaces/cryptography'
import { User } from '@/infra/database/entities/user.entity'
import { inject, injectable } from 'inversify'
import { LOAD_USER_BY_ID_REPOSITORY_SYMBOL } from '@/main/ioc-containers/symbols/repositories'
import { LoadUserByIdRepository } from '../interfaces/database/user/load-user-by-id-repository'
import { DECRYPTER_SYMBOL } from '@/main/ioc-containers/symbols/cryptography/cryptography-symbols'

@injectable()
export default class DbLoadUserByToken implements LoadUserByToken {
  constructor (
    @inject(LOAD_USER_BY_ID_REPOSITORY_SYMBOL) private readonly loadUserByIdRepository: LoadUserByIdRepository,
    @inject(DECRYPTER_SYMBOL) private readonly decrypter: Decrypter
  ) {
  }

  async load (accessToken: string): Promise<User | null> {
    let userId: string

    try {
      userId = await this.decrypter.decrypt(accessToken)
    } catch (error) {
      return null
    }

    const user = await this.loadUserByIdRepository.loadById(parseInt(userId, 10))
    if (user != null) { return user }

    return null
  }
}
