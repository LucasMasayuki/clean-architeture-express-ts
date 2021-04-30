import { AuthMiddleware, AuthMiddlewareRequest } from '@/presentation/middlewares/auth-middleware'
import { forbidden, ok, serverError } from '@/presentation/helpers/http-helper'
import AccessDeniedError from '@/presentation/errors/access_denied_error'
import throwError from '@/tests/domain/mocks/throw-error'
import LoadUserByTokenSpy from '../mocks/load-user-by-token-spy'

const mockRequest = (): AuthMiddlewareRequest => ({
    accessToken: 'any_token',
})

type SutTypes = {
    sut: AuthMiddleware
    loadUserByTokenSpy: LoadUserByTokenSpy
}

const makeSut = (): SutTypes => {
    const loadUserByTokenSpy = new LoadUserByTokenSpy()
    const sut = new AuthMiddleware(loadUserByTokenSpy)
    return {
        sut,
        loadUserByTokenSpy,
    }
}

describe('Auth Middleware', () => {
    test('Should return 403 if no x-access-token exists in headers', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test('Should call LoadUserByToken with correct accessToken', async () => {
        const { sut, loadUserByTokenSpy } = makeSut()
        const httpRequest = mockRequest()
        await sut.handle(httpRequest)

        expect(loadUserByTokenSpy.accessToken).toBe(httpRequest.accessToken)
    })

    test('Should return 403 if LoadUserByToken returns null', async () => {
        const { sut, loadUserByTokenSpy } = makeSut()
        loadUserByTokenSpy.result = null

        const httpResponse = await sut.handle(mockRequest())

        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test('Should return 200 if LoadUserByToken returns an user', async () => {
        const { sut, loadUserByTokenSpy } = makeSut()
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(
            ok({
                userId: loadUserByTokenSpy.result?.id,
            }),
        )
    })

    test('Should return 500 if LoadUserByToken throws', async () => {
        const { sut, loadUserByTokenSpy } = makeSut()
        jest.spyOn(loadUserByTokenSpy, 'load').mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
