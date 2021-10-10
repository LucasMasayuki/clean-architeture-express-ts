import faker from 'faker'

import {
  Authentication,
  AuthenticationParams,
  AuthenticationResult
} from '@/domain/usecases/authentication'

export default class AuthenticationSpy implements Authentication {
  params: AuthenticationParams

  result: AuthenticationResult | null = {
    accessToken: faker.datatype.uuid(),
    expiratesIn: faker.datatype.number(),
    typeOfToken: 'bearer'
  }

  constructor () {
    this.params = {
      email: '',
      password: ''
    }
  }

  async auth (
    params: AuthenticationParams
  ): Promise<AuthenticationResult | null> {
    this.params = params
    return this.result
  }
}
