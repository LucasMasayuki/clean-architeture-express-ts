import { Middleware } from '@/presentation/interfaces/middlewares'
import { forbidden, ok, serverError } from '@/presentation/helpers/http-helper'
import AccessDeniedError from '@/presentation/errors/access_denied_error'
import { LoadUserByToken } from '@/domain/usecases/load-user-by-token'
import { HttpResponse } from '../interfaces/http-response'

export type AuthMiddlewareRequest = {
    accessToken?: string
}

export class AuthMiddleware implements Middleware {
    private readonly loadUserByToken: LoadUserByToken

    constructor(loadUserByToken: LoadUserByToken) {
        this.loadUserByToken = loadUserByToken
    }

    async handle(request: AuthMiddlewareRequest): Promise<HttpResponse> {
        try {
            const { accessToken } = request

            if (accessToken) {
                const user = await this.loadUserByToken.load(accessToken)
                if (user) {
                    return ok({ userId: user.id })
                }
            }

            return forbidden(new AccessDeniedError())
        } catch (error) {
            return serverError(error)
        }
    }
}
