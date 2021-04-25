import { SignUpController, SignUpControllerRequest } from '@/presentation/controllers/signup-controller'
import EmailInUseError from '@/presentation/errors/email-in-use-error'
import { ok, serverError, badRequest, forbidden } from '@/presentation/helpers/http-helper'
import AuthenticationSpy from '@/tests/presentation/mocks/authentication-spy'
import throwError from '@/tests/domain/mocks/throw-error'
import faker from '@/tests/helpers/faker'
import ValidationSpy from '@/tests/presentation/mocks/validation-spy'
import ServerError from '@/presentation/errors/server-error'
import AddUserSpy from '@/tests/presentation/mocks/add-user-spy'
import MissingParamError from '@/presentation/errors/missing-params-error'

const mockRequest = (): SignUpControllerRequest => {
    const { password } = faker
    return {
        name: faker.name,
        email: faker.email,
        password,
        passwordConfirmation: password,
    }
}

type SutTypes = {
    sut: SignUpController
    addUserSpy: AddUserSpy
    validationSpy: ValidationSpy
    authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
    const authenticationSpy = new AuthenticationSpy()
    const addUserSpy = new AddUserSpy()
    const validationSpy = new ValidationSpy()
    const sut = new SignUpController(addUserSpy, validationSpy, authenticationSpy)

    return {
        sut,
        addUserSpy,
        validationSpy,
        authenticationSpy,
    }
}

describe('SignUp Controller', () => {
    test('Should return 500 if AddUser throws', async () => {
        const { sut, addUserSpy } = makeSut()
        jest.spyOn(addUserSpy, 'add').mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('')))
    })

    test('Should call AddUser with correct values', async () => {
        const { sut, addUserSpy } = makeSut()
        const request = mockRequest()
        await sut.handle(request)
        expect(addUserSpy.params).toEqual({
            name: request.name,
            email: request.email,
            password: request.password,
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

    test('Should call Authentication with correct values', async () => {
        const { sut, authenticationSpy } = makeSut()
        const request = mockRequest()
        await sut.handle(request)
        expect(authenticationSpy.params).toEqual({
            email: request.email,
            password: request.password,
        })
    })

    test('Should return 500 if Authentication throws', async () => {
        const { sut, authenticationSpy } = makeSut()
        jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
