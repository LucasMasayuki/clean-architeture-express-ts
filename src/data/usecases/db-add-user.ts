import { AddUser, AddUserParams, AddUserResult } from '@/domain/usecases/add-user'
import { Hasher } from '@/data/interfaces/cryptography'
import { SaveUserRepository } from '../interfaces/database/user/save-user-repository'
import { User } from '@/infra/database/entities/user.entity'
import { LoadUserByEmailRepository } from '../interfaces/database/user/load-user-by-email-repository'

export default class DbAddUser implements AddUser {
  constructor (
    private readonly hasher: Hasher,
    private readonly saveUserRepository: SaveUserRepository,
    private readonly loadUserRepository: LoadUserByEmailRepository
  ) {
  }

  async add (params: AddUserParams): Promise<AddUserResult> {
    const existentUser = await this.loadUserRepository.loadByEmail(params.email)

    let isValid = false
    if (existentUser == null) {
      const hashedPassword = await this.hasher.hash(params.password)
      const entity = new User()
      entity.birthDate = params.birthDate
      entity.password = hashedPassword
      entity.firstName = params.firstName
      entity.lastName = params.lastName
      entity.email = params.email

      const user = await this.saveUserRepository.saveUser(entity)
      isValid = user != null
    }

    return isValid
  }
}
