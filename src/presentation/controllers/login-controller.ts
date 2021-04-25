import { Controller } from '@/presentation/interfaces/controller'
import { HttpResponse } from '@/presentation/interfaces/http-response'
import { Validation } from '@/presentation/interfaces/validation'
import { badRequest, serverError, unauthorized, ok } from '@/presentation/helpers/http-helper'
import { Authentication } from '@/domain/usecases/authentication'

export type LoginControllerRequest = {
    email: string
    password: string
}

export class LoginController implements Controller {
    private readonly authentication: Authentication

    private readonly validation: Validation

    constructor(authentication: Authentication, validation: Validation) {
        this.authentication = authentication
        this.validation = validation
    }

    async handle(request: LoginControllerRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request)

            if (error) {
                return badRequest(error)
            }

            const authenticationModel = await this.authentication.auth(request)

            if (!authenticationModel) {
                return unauthorized()
            }

            return ok(authenticationModel)
        } catch (error) {
            return serverError(error)
        }
    }
}
