import makeSignUpValidation from '@/main/factories/controllers/signup-validation-factory'
import CompareFieldsValidation from '@/validation/validators/compare-fields-validation'
import { Validation } from '@/presentation/interfaces/validation'
import EmailValidatorAdapter from '@/infra/validators/email-validator-adapter'
import RequiredFieldValidation from '@/validation/validators/required-field-validation'
import EmailValidation from '@/validation/validators/email-validation'
import ValidationComposite from '@/validation/validators/validation-composite'

jest.mock('@/validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeSignUpValidation()
        const validations: Validation[] = []
        const fields = ['firstName', 'lastName', 'email', 'birthDate', 'password', 'passwordConfirmation']

        fields.forEach((field) => {
            validations.push(new RequiredFieldValidation(field))
        })

        validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
        validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
