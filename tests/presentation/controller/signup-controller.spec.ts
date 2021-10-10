import faker from 'faker'
import {
  ok,
  serverError,
  forbidden
} from '@/presentation/helpers/http-helper'
import AuthenticationSpy from '@/tests/presentation/mocks/authentication-spy'
import throwError from '@/tests/domain/mocks/throw-error'
import AddUserSpy from '@/tests/presentation/mocks/add-user-spy'
import { SignUpController, SignUpControllerRequest } from '@/presentation/controllers/authentication/signup-controller'
import { EmailInUseError, ServerError } from '@/presentation/errors'

const mockRequest = (): SignUpControllerRequest => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.firstName(),
  birthDate: new Date(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  passwordConfirmation: faker.internet.password()
})

type SutTypes = {
  sut: SignUpController
  addUserSpy: AddUserSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const addUserSpy = new AddUserSpy()
  const sut = new SignUpController(
    addUserSpy,
    authenticationSpy
  )

  return {
    sut,
    addUserSpy,
    authenticationSpy
  }
}

describe('SignUp Controller', () => {
  test('Should return 500 if AddUser throws', async () => {
    const { sut, addUserSpy } = makeSut()
    jest.spyOn(addUserSpy, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should call AddUser with correct values', async () => {
    const { sut, addUserSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(addUserSpy.params).toEqual({
      firstName: request.firstName,
      lastName: request.lastName,
      birthDate: request.birthDate,
      email: request.email,
      password: request.password
    })
  })

  test('Should return 403 if AddUser returns false', async () => {
    const { sut, addUserSpy } = makeSut()
    addUserSpy.result = false
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ auth: authenticationSpy.result }))
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

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
