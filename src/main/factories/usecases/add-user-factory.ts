import DbAddUser from '@/data/usecases/db-add-user'
import { AddUser } from '@/domain/usecases/add-user'
import UserMongoRepository from '@/infra/database/mongodb/repositories/user-mongo-repository'
import BcryptAdapter from '@/infra/cryptography/bcrypt-adapter'

const makeDbAddUser = (): AddUser => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const userMongoRepository = new UserMongoRepository()

    return new DbAddUser(bcryptAdapter, userMongoRepository, userMongoRepository)
}

export default makeDbAddUser
