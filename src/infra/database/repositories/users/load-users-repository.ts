/* eslint-disable class-methods-use-this */

import { LoadUserByEmailRepository } from '@/data/interfaces/database/user/load-user-by-email-repository'
import { LoadUserByIdRepository } from '@/data/interfaces/database/user/load-user-by-id-repository'
import { User } from '../../entities/user.entity'
import DbRepository from '../db-repository'

export default class LoadUsersRepository
  extends DbRepository
  implements LoadUserByEmailRepository, LoadUserByIdRepository {
  async loadByEmail (email: string): Promise<User | undefined> {
    const userRepository = this.getRepository(User)
    return await userRepository.findOne({ email })
  }

  async loadById (id: number): Promise<User | undefined> {
    const userRepository = this.getRepository(User)
    return await userRepository.findOne({ id })
  }
}
