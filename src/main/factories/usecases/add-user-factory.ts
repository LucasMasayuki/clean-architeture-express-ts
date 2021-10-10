import DbAddUser from '@/data/usecases/db-add-user'
import { AddUser } from '@/domain/usecases/add-user'
import BcryptAdapter from '@/infra/cryptography/bcrypt-adapter'
import LoadUsersRepository from '@/infra/database/repositories/users/load-users-repository'
import SaveUsersRepository from '@/infra/database/repositories/users/save-users-repository'

const makeDbAddUser = (): AddUser => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const saveUsersRepository = new SaveUsersRepository()
  const loadUsersRepository = new LoadUsersRepository()

  return new DbAddUser(bcryptAdapter, saveUsersRepository, loadUsersRepository)
}

export default makeDbAddUser
