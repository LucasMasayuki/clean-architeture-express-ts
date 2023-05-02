import { AddUser, AddUserParams, AddUserResult } from '@/domain/usecases/add-user'
import { Hasher } from '@/data/interfaces/cryptography'
import { SaveUserRepository } from '../interfaces/database/user/save-user-repository'
import { User } from '@/infra/database/entities/user.entity'
import { LoadUserByEmailRepository } from '../interfaces/database/user/load-user-by-email-repository'
import { HASHER_SYMBOL } from '@/main/ioc-containers/symbols/cryptography/cryptography-symbols'
import { inject, injectable } from 'inversify'
import { LOAD_USER_BY_EMAIL_REPOSITORY_SYMBOL, SAVE_USER_REPOSITORY_SYMBOL } from '@/main/ioc-containers/symbols/repositories'

@injectable()
export default class DbAddUser implements AddUser {
  constructor (
    @inject(HASHER_SYMBOL) private readonly hasher: Hasher,
    @inject(SAVE_USER_REPOSITORY_SYMBOL) private readonly saveUserRepository: SaveUserRepository,
    @inject(LOAD_USER_BY_EMAIL_REPOSITORY_SYMBOL) private readonly loadUserByEmailRepository: LoadUserByEmailRepository
  ) {
  }

  async add (params: AddUserParams): Promise<AddUserResult> {
    const existentUser = await this.loadUserByEmailRepository.loadByEmail(params.email)

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
