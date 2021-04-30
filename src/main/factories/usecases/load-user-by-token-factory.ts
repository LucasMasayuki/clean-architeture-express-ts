import env from '@/main/config/env'
import { LoadUserByToken } from '@/domain/usecases/load-user-by-token'
import DbLoadUserByToken from '@/data/usecases/db-load-user-by-token'
import UserMongoRepository from '@/infra/database/mongodb/repositories/user-mongo-repository'
import JwtAdapter from '@/infra/cryptography/jwt-adapter'

const makeDbLoadUserByToken = (): LoadUserByToken => {
    const jwtAdapter = new JwtAdapter(env.jwtSecret ?? '')
    const userMongoRepository = new UserMongoRepository()

    return new DbLoadUserByToken(jwtAdapter, userMongoRepository)
}

export default makeDbLoadUserByToken
