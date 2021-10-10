import { LoadUserByEmailRepository } from '@/data/interfaces/database/user/load-user-by-email-repository'
import { User } from '@/infra/database/entities/user.entity'
import UserMock from '@/tests/infra/database/mocks/entities/user-mock.entity'

export default class LoadUserByEmailRepositorySpy
implements LoadUserByEmailRepository {
  email: string | undefined

  result: User | undefined = new UserMock()

  async loadByEmail (email: string): Promise<User | undefined> {
    this.email = email

    return this.result
  }
}
