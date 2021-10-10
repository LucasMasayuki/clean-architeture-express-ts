import { ForbiddenError, ServerError, UnauthorizedError, UnprocessableEntityError } from '../errors/http'

export type HttpResponse<T = any> = {
  statusCode: number
  data: T
}

export const ok = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: HttpStatus.OK,
  data
})

export const badRequest = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: HttpStatus.BAD_REQUEST,
  data
})

export const forbidden = (error?: unknown): HttpResponse<Error> => ({
  statusCode: HttpStatus.FORBIDDEN,
  data: new ForbiddenError(error instanceof Error ? error : undefined)
})

export const unprocessableEntity = (error?: unknown): HttpResponse<Error> => ({
  statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  data: new UnprocessableEntityError(error instanceof Error ? error : undefined)
})

export const unauthorized = (): HttpResponse<Error> => ({
  statusCode: HttpStatus.UNAUTHORIZED,
  data: new UnauthorizedError()
})

export const serverError = (error?: unknown): HttpResponse<Error> => ({
  statusCode: HttpStatus.ERROR,
  data: new ServerError(error instanceof Error ? error : undefined)
})

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  OK_RANGE_END = 299,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  GONE = 410,
  UNSUPPORTED_MEDIA_TYPE = 415,
  UNPROCESSABLE_ENTITY = 420,
  TOO_MANY_REQUESTS = 429,
  ERROR = 500,
}
