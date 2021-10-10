import { LoadUserByToken } from '@/domain/usecases/load-user-by-token'
import { Decrypter } from '@/data/interfaces/cryptography'
import { User } from '@/infra/database/entities/user.entity'
import { LoadUserByIdRepository } from '../interfaces/database/user/load-user-by-id-repository'

export default class DbLoadUserByToken implements LoadUserByToken {
  constructor (private readonly userRepository: LoadUserByIdRepository, private readonly decrypter: Decrypter) {
  }

  async load (accessToken: string): Promise<User | null> {
    let userId: string

    try {
      userId = await this.decrypter.decrypt(accessToken)
    } catch (error) {
      return null
    }

    const user = await this.userRepository.loadById(parseInt(userId, 10))
    if (user != null) {
      return user
    }

    return null
  }
}
