import makeLoginValidation from '@/main/factories/controllers/login-validation-factory'
import { Validation } from '@/presentation/interfaces/validation'
import EmailValidatorAdapter from '@/infra/validators/email-validator-adapter'
import RequiredFieldValidation from '@/validation/validators/required-field-validation'
import EmailValidation from '@/validation/validators/email-validation'
import ValidationComposite from '@/validation/validators/validation-composite'

jest.mock('@/validation/validators/validation-composite')

describe('LoginValidation Factory', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeLoginValidation()
        const validations: Validation[] = []
        const fields = ['email', 'password']

        fields.forEach((field) => {
            validations.push(new RequiredFieldValidation(field))
        })

        validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
