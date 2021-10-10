import { unauthorized, ok, HttpResponse } from '@/presentation/helpers/http-helper'
import { Authentication } from '@/domain/usecases/authentication'
import Controller from '../controller'
import { ValidationBuilder as Builder, Validator } from '@/validation/validators'

export type LoginControllerRequest = {
  email: string
  password: string
}

export class LoginController extends Controller {
  constructor (private readonly useCase: Authentication) {
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
