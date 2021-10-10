import { ok, forbidden, HttpResponse } from '@/presentation/helpers/http-helper'
import { AddUser } from '@/domain/usecases/add-user'
import { Authentication } from '@/domain/usecases/authentication'
import Controller from '../controller'
import { ValidationBuilder as Builder, Validator } from '@/validation/validators'
import { EmailInUseError } from '@/presentation/errors'

export type SignUpControllerRequest = {
  firstName: string
  lastName: string
  birthDate: Date
  email: string
  password: string
  passwordConfirmation: string
}

export class SignUpController extends Controller {
  constructor (
    private readonly useCase: AddUser,
    private readonly authentication: Authentication
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
