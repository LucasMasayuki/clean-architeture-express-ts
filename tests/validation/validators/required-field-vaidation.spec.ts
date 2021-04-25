import RequiredFieldValidation from '@/validation/validators/required-field-validation'
import MissingParamError from '@/presentation/errors/missing-params-error'

import faker from '@/tests/helpers/faker'

const field = faker.words

const makeSut = (): RequiredFieldValidation => {
    return new RequiredFieldValidation(field)
}

describe('RequiredField Validation', () => {
    test('Should return a MissingParamError if validation fails', () => {
        const sut = makeSut()
        const error = sut.validate({ invalidField: faker.words })
        expect(error).toEqual(new MissingParamError(field))
    })

    test('Should not return if validation succeeds', () => {
        const sut = makeSut()
        const error = sut.validate({ [field]: faker.words })
        expect(error).toBeFalsy()
    })
})
