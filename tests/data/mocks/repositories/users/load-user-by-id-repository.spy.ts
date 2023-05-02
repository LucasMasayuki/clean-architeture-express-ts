import { LoadUserByIdRepository } from '@/data/interfaces/database/user/load-user-by-id-repository'
import { User } from '@/infra/database/entities/user.entity'
import UserMock from '@/tests/infra/database/mocks/entities/user-mock.entity'
import { injectable } from 'inversify'

injectable()
export default class LoadUserByIdRepostorySpy
implements LoadUserByIdRepository {
  id: number | undefined

  result: User | undefined = new UserMock()

  async loadById (id: number): Promise<User | undefined> {
    this.id = id
    return this.result
  }
}
