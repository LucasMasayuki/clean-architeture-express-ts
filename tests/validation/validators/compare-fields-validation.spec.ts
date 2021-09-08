import CompareFieldsValidation from '@/validation/validators/compare-fields-validation'
import InvalidParamError from '@/presentation/errors/invalid-param-error'
import faker from 'faker'

const field = faker.random.words()
const fieldToCompare = `${faker.random.words()} 1`

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
        const value = faker.random.words()
        const error = sut.validate({
            [field]: value,
            [fieldToCompare]: value,
        })

        expect(error).toBeFalsy()
    })
})
