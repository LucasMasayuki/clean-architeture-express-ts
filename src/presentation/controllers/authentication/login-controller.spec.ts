import faker from 'faker'

import {
  serverError,
  unauthorized,
  ok
} from '@/presentation/helpers/http-helper'
import throwError from '@/tests/domain/mocks/throw-error'

import { LoginController, LoginControllerRequest } from '@/presentation/controllers/authentication/login-controller'
import { TestContainer } from '@/main/ioc-containers/inversify-config-test'
import { AUTHENTICATION_SYMBOL } from '@/main/ioc-containers/symbols/use-cases'
import AuthenticationSpy from '@/tests/presentation/mocks/authentication-spy'

const mockRequest = (): LoginControllerRequest => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

type SutTypes = {
  sut: LoginController
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()

  TestContainer.bind(AUTHENTICATION_SYMBOL).toConstantValue(authenticationSpy)

  const sut = TestContainer.resolve(LoginController)

  return {
    sut,
    authenticationSpy
  }
}

describe('Login Controller', () => {
  beforeEach(() => {
    TestContainer.snapshot()
  })

  afterEach(() => {
    TestContainer.restore()
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(authenticationSpy.params).toEqual({
      email: request.email,
      password: request.password
    })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.result = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ auth: authenticationSpy.result }))
  })
})
