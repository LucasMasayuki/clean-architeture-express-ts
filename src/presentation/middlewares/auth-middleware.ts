import { Middleware } from '@/presentation/interfaces/middlewares'
import { forbidden, HttpResponse, ok, serverError } from '@/presentation/helpers/http-helper'
import { LoadUserByToken } from '@/domain/usecases/load-user-by-token'

export type AuthMiddlewareRequest = {
  token?: string
}

export class AuthMiddleware implements Middleware {
  private readonly loadUserByToken: LoadUserByToken

  constructor (loadUserByToken: LoadUserByToken) {
    this.loadUserByToken = loadUserByToken
  }

  async handle (request: AuthMiddlewareRequest): Promise<HttpResponse> {
    try {
      const { token } = request

      if (token != null) {
        const user = await this.loadUserByToken.load(token)

        if (user != null) {
          return ok({ userId: user.id })
        }
      }

      return forbidden()
    } catch (error) {
      return serverError(error)
    }
  }
}
