import EmailValidation from '@/validation/validators/email-validation'
import InvalidParamError from '@/presentation/errors/invalid-param-error'
import EmailValidatorSpy from '@/tests/validation/mocks/email-validator-spy'
import throwError from '@/tests/domain/mocks/throw-error'

import faker from '@/tests/helpers/faker'

const field = faker.words

type SutTypes = {
    sut: EmailValidation
    emailValidatorSpy: EmailValidatorSpy
}

const makeSut = (): SutTypes => {
    const emailValidatorSpy = new EmailValidatorSpy()
    const sut = new EmailValidation(field, emailValidatorSpy)
    return {
        sut,
        emailValidatorSpy,
    }
}

describe('Email Validation', () => {
    test('Should return an error if EmailValidator returns false', () => {
        const { sut, emailValidatorSpy } = makeSut()
        emailValidatorSpy.isEmailValid = false
        const { email } = faker
        const error = sut.validate({ [field]: email })
        expect(error).toEqual(new InvalidParamError(field))
    })

    test('Should call EmailValidator with correct email', () => {
        const { sut, emailValidatorSpy } = makeSut()
        const { email } = faker
        sut.validate({ [field]: email })
        expect(emailValidatorSpy.email).toBe(email)
    })

    test('Should throw if EmailValidator throws', () => {
        const { sut, emailValidatorSpy } = makeSut()
        jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(throwError)
        expect(sut.validate).toThrow()
    })
})
