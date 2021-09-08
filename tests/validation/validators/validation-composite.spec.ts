import ValidationComposite from '@/validation/validators/validation-composite'
import MissingParamError from '@/presentation/errors/missing-params-error'
import ValidationSpy from '@/tests/presentation/mocks/validation-spy'
import faker from 'faker'

const field = faker.random.words()

type SutTypes = {
    sut: ValidationComposite
    validationSpies: ValidationSpy[]
}

const makeSut = (): SutTypes => {
    const validationSpies = [new ValidationSpy(), new ValidationSpy()]
    const sut = new ValidationComposite(validationSpies)
    return {
        sut,
        validationSpies,
    }
}

describe('Validation Composite', () => {
    test('Should return an error if any validation fails', () => {
        const { sut, validationSpies } = makeSut()
        validationSpies[1].error = new MissingParamError(field)
        const error = sut.validate({ [field]: faker.random.words() })
        expect(error).toEqual(validationSpies[1].error)
    })

    test('Should return the first error if more then one validation fails', () => {
        const { sut, validationSpies } = makeSut()
        validationSpies[0].error = new Error()
        validationSpies[1].error = new MissingParamError(field)
        const error = sut.validate({ [field]: faker.random.words() })
        expect(error).toEqual(validationSpies[0].error)
    })

    test('Should not return if validation succeeds', () => {
        const { sut } = makeSut()
        const error = sut.validate({ [field]: faker.random.words() })
        expect(error).toBeFalsy()
    })
})
