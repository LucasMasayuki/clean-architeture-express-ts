import CompareFieldsValidation from '@/validation/validators/compare-fields-validation'
import InvalidParamError from '@/presentation/errors/invalid-param-error'

import faker from '@/tests/helpers/faker'

const field = faker.words
const fieldToCompare = `${faker.words} 1`

const makeSut = (): CompareFieldsValidation => {
    return new CompareFieldsValidation(field, fieldToCompare)
}

describe('CompareFieldsValidation', () => {
    test('Should return an InvalidParamError if validation fails', () => {
        const sut = makeSut()
        const error = sut.validate({
            [field]: 'any_field',
            [fieldToCompare]: 'other_field',
        })

        expect(error).toEqual(new InvalidParamError(fieldToCompare))
    })

    test('Should not return if validation succeeds', () => {
        const sut = makeSut()
        const value = faker.words
        const error = sut.validate({
            [field]: value,
            [fieldToCompare]: value,
        })

        expect(error).toBeFalsy()
    })
})
