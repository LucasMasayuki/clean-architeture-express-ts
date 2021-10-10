import { SaveUserRepository } from '@/data/interfaces/database/user/save-user-repository'
import { User } from '@/infra/database/entities/user.entity'

export default class SaveUserRepositorySpy implements SaveUserRepository {
  user: User | undefined

  result: User | undefined = undefined

  async saveUser (user: User): Promise<User | undefined> {
    this.user = user
    return this.result
  }
}
