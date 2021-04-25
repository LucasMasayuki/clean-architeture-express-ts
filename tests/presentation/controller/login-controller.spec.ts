import { LoginController, LoginControllerRequest } from '@/presentation/controllers/login-controller'
import { badRequest, serverError, unauthorized, ok } from '@/presentation/helpers/http-helper'
import MissingParamError from '@/presentation/errors/missing-params-error'
import ValidationSpy from '@/tests/presentation/mocks/validation-spy'
import throwError from '@/tests/domain/mocks/throw-error'

import faker from '@/tests/helpers/faker'
import AuthenticationSpy from '../mocks/authentication-spy'

const mockRequest = (): LoginControllerRequest => ({
    email: faker.email,
    password: faker.password,
})

type SutTypes = {
    sut: LoginController
    authenticationSpy: AuthenticationSpy
    validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
    const authenticationSpy = new AuthenticationSpy()
    const validationSpy = new ValidationSpy()
    const sut = new LoginController(authenticationSpy, validationSpy)
    return {
        sut,
        authenticationSpy,
        validationSpy,
    }
}

describe('Login Controller', () => {
    test('Should call Authentication with correct values', async () => {
        const { sut, authenticationSpy } = makeSut()
        const request = mockRequest()
        await sut.handle(request)
        expect(authenticationSpy.params).toEqual({
            email: request.email,
            password: request.password,
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
        expect(httpResponse).toEqual(ok(authenticationSpy.result))
    })

    test('Should call Validation with correct value', async () => {
        const { sut, validationSpy } = makeSut()
        const request = mockRequest()
        await sut.handle(request)
        expect(validationSpy.input).toEqual(request)
    })

    test('Should return 400 if Validation returns an error', async () => {
        const { sut, validationSpy } = makeSut()
        validationSpy.error = new MissingParamError(faker.words)
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(badRequest(validationSpy.error))
    })
})
