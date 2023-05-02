/* eslint-disable @typescript-eslint/no-unused-vars */

import { Encrypter, HashComparer, Hasher } from '@/data/interfaces/cryptography'
import Sha256Adapter from '@/infra/cryptography/sha256-adapter'
import { Container } from 'inversify'
import { ENCRYPTER_SYMBOL, HASHER_SYMBOL, HASH_COMPARER_SYMBOL } from '../../symbols/cryptography/cryptography-symbols'
import JwtAdapter from '@/infra/cryptography/jwt-adapter'
import env from '@/main/config/env'

const CryptographyContainer = new Container()

CryptographyContainer
  .bind<HashComparer>(HASH_COMPARER_SYMBOL)
  .to(Sha256Adapter)

CryptographyContainer
  .bind<Hasher>(HASHER_SYMBOL)
  .to(Sha256Adapter)

CryptographyContainer
  .bind<Encrypter>(ENCRYPTER_SYMBOL)
  .toDynamicValue(() => {
    return new JwtAdapter(env.jwtSecret ?? '', env.jwtExpirationIn)
  })

export default CryptographyContainer
