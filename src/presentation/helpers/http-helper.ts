import { HttpResponse } from '@/presentation/interfaces/http-response'
import HttpStatus from '@/shared/enums/httpStatus'
import ServerError from '../errors/server-error'
import UnauthorizedError from '../errors/unauthorize-error'

export const badRequest = (error: Error): HttpResponse => ({
    statusCode: HttpStatus.BAD_REQUEST,
    body: error,
})

export const forbidden = (error: Error): HttpResponse => ({
    statusCode: HttpStatus.FORBIDDEN,
    body: error,
})

export const unauthorized = (): HttpResponse => ({
    statusCode: HttpStatus.UNAUTHORIZED,
    body: new UnauthorizedError(),
})

export const serverError = (error: Error): HttpResponse => ({
    statusCode: HttpStatus.ERROR,
    body: new ServerError(error.stack ?? ''),
})

export const ok = (data: any): HttpResponse => ({
    statusCode: HttpStatus.OK,
    body: data,
})

export const noContent = (): HttpResponse => ({
    statusCode: HttpStatus.NO_CONTENT,
    body: null,
})
