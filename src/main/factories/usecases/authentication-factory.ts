import env from '@/main/config/env'
import DbAuthentication from '@/data/usecases/db-authentication'
import { Authentication } from '@/domain/usecases/authentication'
import BcryptAdapter from '@/infra/cryptography/bcrypt-adapter'
import JwtAdapter from '@/infra/cryptography/jwt-adapter'
import UserMongoRepository from '@/infra/database/mongodb/repositories/user-mongo-repository'

const makeDbAuthentication = (): Authentication => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const jwtAdapter = new JwtAdapter(env.jwtSecret ?? '')
    const userMongoRepository = new UserMongoRepository()

    return new DbAuthentication(userMongoRepository, bcryptAdapter, jwtAdapter, userMongoRepository)
}

export default makeDbAuthentication
