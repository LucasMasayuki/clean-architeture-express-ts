import { LoadUserByToken } from '@/domain/usecases/load-user-by-token'
import { User } from '@/infra/database/entities/user.entity'
import UserMock from '@/tests/infra/database/mocks/entities/user-mock.entity'

export default class LoadUserByTokenSpy implements LoadUserByToken {
  accessToken: string

  result: User | null

  constructor () {
    this.accessToken = ''
    this.result = new UserMock()
  }

  async load (accessToken: string): Promise<User | null> {
    this.accessToken = accessToken
    return this.result
  }
}
