import { Container } from 'inversify'
import {
  LOAD_USER_BY_EMAIL_REPOSITORY_SYMBOL,
  LOAD_USER_BY_ID_REPOSITORY_SYMBOL,
  SAVE_USER_REPOSITORY_SYMBOL
} from '../../symbols/repositories/users-repositories-symbols'
import { LoadUserByEmailRepository } from '@/data/interfaces/database/user/load-user-by-email-repository'
import LoadUsersRepository from '@/infra/database/repositories/users/load-users-repository'
import { SaveUserRepository } from '@/data/interfaces/database/user/save-user-repository'
import SaveUsersRepository from '@/infra/database/repositories/users/save-users-repository'
import { LoadUserByIdRepository } from '@/data/interfaces/database/user/load-user-by-id-repository'

const UsersRepositoryContainer = new Container()

UsersRepositoryContainer
  .bind<LoadUserByEmailRepository>(LOAD_USER_BY_EMAIL_REPOSITORY_SYMBOL)
  .to(LoadUsersRepository)

UsersRepositoryContainer
  .bind<LoadUserByIdRepository>(LOAD_USER_BY_ID_REPOSITORY_SYMBOL)
  .to(LoadUsersRepository)

UsersRepositoryContainer
  .bind<SaveUserRepository>(SAVE_USER_REPOSITORY_SYMBOL)
  .to(SaveUsersRepository)

export default UsersRepositoryContainer
