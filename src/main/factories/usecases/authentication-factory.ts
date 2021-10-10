import env from '@/main/config/env'
import DbAuthentication from '@/data/usecases/db-authentication'
import { Authentication } from '@/domain/usecases/authentication'
import JwtAdapter from '@/infra/cryptography/jwt-adapter'
import Sha256Adapter from '@/infra/cryptography/sha256-adapter'
import LoadUsersRepository from '@/infra/database/repositories/users/load-users-repository'

const makeDbAuthentication = (): Authentication => {
  const sha256Adapter = new Sha256Adapter()
  const jwtAdapter = new JwtAdapter(env.jwtSecret ?? '', env.jwtExpirationIn)
  const loadUserRepository = new LoadUsersRepository()

  return new DbAuthentication(loadUserRepository, sha256Adapter, jwtAdapter)
}

export default makeDbAuthentication
