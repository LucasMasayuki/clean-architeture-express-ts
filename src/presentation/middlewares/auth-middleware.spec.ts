import {
  AuthMiddleware,
  AuthMiddlewareRequest
} from '@/presentation/middlewares/auth-middleware'
import { forbidden, ok, serverError } from '@/presentation/helpers/http-helper'
import throwError from '@/tests/domain/mocks/throw-error'
import LoadUserByTokenSpy from '@/tests/presentation/mocks/load-user-by-token-spy'
import { LOAD_USER_BY_TOKEN_SYMBOL } from '@/main/ioc-containers/symbols/use-cases'
import { TestContainer } from '@/main/ioc-containers/inversify-config-test'

const mockRequest = (): AuthMiddlewareRequest => ({
  token: 'any_token'
})

  type SutTypes = {
    sut: AuthMiddleware
    loadUserByTokenSpy: LoadUserByTokenSpy
  }

const makeSut = (): SutTypes => {
  const loadUserByTokenSpy = new LoadUserByTokenSpy()

  TestContainer.bind(LOAD_USER_BY_TOKEN_SYMBOL).toConstantValue(loadUserByTokenSpy)

  const sut = TestContainer.resolve(AuthMiddleware)

  return {
    sut,
    loadUserByTokenSpy
  }
}

describe('Auth Middleware', () => {
  beforeEach(() => {
    TestContainer.snapshot()
  })

  afterEach(() => {
    TestContainer.restore()
  })

  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden())
  })

  test('Should call LoadUserByToken with correct accessToken', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(loadUserByTokenSpy.accessToken).toBe(httpRequest.token)
  })

  test('Should return 403 if LoadUserByToken returns null', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    loadUserByTokenSpy.result = null

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden())
  })

  test('Should return 200 if LoadUserByToken returns an user', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(
      ok({
        userId: loadUserByTokenSpy.result?.id
      })
    )
  })

  test('Should return 500 if LoadUserByToken throws', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    jest.spyOn(loadUserByTokenSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
