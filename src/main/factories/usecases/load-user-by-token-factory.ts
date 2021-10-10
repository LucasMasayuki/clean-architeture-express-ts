import env from '@/main/config/env'
import { LoadUserByToken } from '@/domain/usecases/load-user-by-token'
import DbLoadUserByToken from '@/data/usecases/db-load-user-by-token'
import JwtAdapter from '@/infra/cryptography/jwt-adapter'
import LoadUsersRepository from '@/infra/database/repositories/users/load-users-repository'

const makeDbLoadUserByToken = (): LoadUserByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret ?? '', env.jwtExpirationIn)
  const loadUserRepository = new LoadUsersRepository()

  return new DbLoadUserByToken(loadUserRepository, jwtAdapter)
}

export default makeDbLoadUserByToken
