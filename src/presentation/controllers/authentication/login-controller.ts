import 'reflect-metadata'

import { unauthorized, ok, HttpResponse } from '@/presentation/helpers/http-helper'
import { ValidationBuilder as Builder, Validator } from '@/validation/validators'
import { Controller } from '../controller'
import { inject, injectable } from 'inversify'
import { AUTHENTICATION_SYMBOL } from '@/main/ioc-containers/symbols/use-cases'
import { Authentication } from '@/domain/usecases/authentication'

export type LoginControllerRequest = {
  email: string
  password: string
}

@injectable()
export class LoginController extends Controller {
  constructor (@inject(AUTHENTICATION_SYMBOL) private readonly useCase: Authentication) {
    super()
  }

  async perform (request: LoginControllerRequest): Promise<HttpResponse> {
    const auth = await this.useCase.auth(request)

    if (auth == null) {
      return unauthorized()
    }

    return ok({ auth })
  }

  override buildValidators ({ email, password }: LoginControllerRequest): Validator[] {
    return [
      ...Builder.of({ value: email, fieldName: 'email' }).required().build(),
      ...Builder.of({ value: password, fieldName: 'password' }).required().build()
    ]
  }
}
