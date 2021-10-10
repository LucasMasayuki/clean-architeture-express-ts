import { Request, Response, NextFunction } from 'express'
import { Middleware } from '@/presentation/interfaces/middlewares'
import HttpStatus from '@/shared/enums/httpStatus'

const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization
    const bearerToken = authHeader?.split(' ')[1]

    const request = {
      accessToken: req.headers?.['x-access-token'],
      token: bearerToken,
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      ...(req.headers || {})
    }

    const httpResponse = await middleware.handle(request)
    if (httpResponse.statusCode === HttpStatus.OK) {
      Object.assign(req, httpResponse.data)
      next()
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.data.message
      })
    }
  }
}

export default adaptMiddleware
