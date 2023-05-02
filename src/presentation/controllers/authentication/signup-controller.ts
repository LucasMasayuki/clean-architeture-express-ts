import { ok, forbidden, HttpResponse } from '@/presentation/helpers/http-helper'
import { AddUser } from '@/domain/usecases/add-user'
import { Authentication } from '@/domain/usecases/authentication'
import { ValidationBuilder as Builder, Validator } from '@/validation/validators'
import { EmailInUseError } from '@/presentation/errors'
import { Controller } from '../controller'
import { ADD_USER_SYMBOL, AUTHENTICATION_SYMBOL } from '@/main/ioc-containers/symbols/use-cases'
import { inject, injectable } from 'inversify'

export type SignUpControllerRequest = {
  firstName: string
  lastName: string
  birthDate: Date
  email: string
  password: string
  passwordConfirmation: string
}

@injectable()
export class SignUpController extends Controller {
  constructor (
    @inject(AUTHENTICATION_SYMBOL) private readonly authentication: Authentication,
    @inject(ADD_USER_SYMBOL) private readonly useCase: AddUser
  ) {
    super()
  }

  async perform (request: SignUpControllerRequest): Promise<HttpResponse> {
    const { firstName, lastName, birthDate, email, password } = request
    const isValid = await this.useCase.add({
      firstName,
      lastName,
      birthDate,
      email,
      password
    })

    if (!isValid) {
      return forbidden(new EmailInUseError())
    }

    const auth = await this.authentication.auth({
      email,
      password
    })

    return ok({ auth })
  }

  override buildValidators ({ firstName, lastName, email, password }: SignUpControllerRequest): Validator[] {
    return [
      ...Builder.of({ value: email, fieldName: 'email' }).required().email().build(),
      ...Builder.of({ value: firstName, fieldName: 'firstName' }).required().build(),
      ...Builder.of({ value: lastName, fieldName: 'lastName' }).required().build(),
      ...Builder.of({ value: password, fieldName: 'password' }).required().build()
    ]
  }
}
