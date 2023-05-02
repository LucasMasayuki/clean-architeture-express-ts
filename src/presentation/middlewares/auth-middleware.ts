import 'reflect-metadata'

import { Middleware } from '@/presentation/interfaces/middlewares'
import { forbidden, HttpResponse, ok, serverError } from '@/presentation/helpers/http-helper'
import { LoadUserByToken } from '@/domain/usecases/load-user-by-token'
import { inject, injectable } from 'inversify'
import { LOAD_USER_BY_TOKEN_SYMBOL } from '@/main/ioc-containers/symbols/use-cases'

export type AuthMiddlewareRequest = {
  token?: string
}

@injectable()
export class AuthMiddleware implements Middleware {
  constructor (@inject(LOAD_USER_BY_TOKEN_SYMBOL) private readonly loadUserByToken: LoadUserByToken) {
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
