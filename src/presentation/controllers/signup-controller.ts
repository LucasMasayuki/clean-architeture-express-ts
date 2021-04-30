import { Controller } from '@/presentation/interfaces/controller'
import { HttpResponse } from '@/presentation/interfaces/http-response'
import { badRequest, serverError, ok, forbidden } from '@/presentation/helpers/http-helper'
import EmailInUseError from '@/presentation/errors/email-in-use-error'
import { AddUser } from '@/domain/usecases/add-user'
import { Authentication } from '@/domain/usecases/authentication'
import { Validation } from '../interfaces/validation'

export type SignUpControllerRequest = {
    firstName: string
    lastName: string
    birthDate: Date
    email: string
    password: string
    passwordConfirmation: string
}

export class SignUpController implements Controller {
    private readonly addUser: AddUser

    private readonly validation: Validation

    private readonly authentication: Authentication

    constructor(addUser: AddUser, validation: Validation, authentication: Authentication) {
        this.addUser = addUser
        this.validation = validation
        this.authentication = authentication
    }

    async handle(request: SignUpControllerRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request)

            if (error) {
                return badRequest(error)
            }

            const { firstName, lastName, birthDate, email, password } = request
            const isValid = await this.addUser.add({
                firstName,
                lastName,
                birthDate,
                email,
                password,
            })

            if (!isValid) {
                return forbidden(new EmailInUseError())
            }

            const authenticationModel = await this.authentication.auth({
                email,
                password,
            })

            return ok(authenticationModel)
        } catch (error) {
            return serverError(error)
        }
    }
}
