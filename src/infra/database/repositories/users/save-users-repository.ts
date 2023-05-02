import { SaveUserRepository } from '@/data/interfaces/database/user/save-user-repository'
import { User } from '../../entities/user.entity'
import DbRepository from '../db-repository'
import { injectable } from 'inversify'

@injectable()
export default class SaveUsersRepository
  extends DbRepository
  implements SaveUserRepository {
  async saveUser (user: User): Promise<User | undefined> {
    const userRepository = this.getRepository(User)
    return await userRepository.save(user)
  }
}
