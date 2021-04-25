import { Validation } from '@/presentation/interfaces/validation'
import EmailValidatorAdapter from '@/infra/validators/email-validator-adapter'
import RequiredFieldValidation from '@/validation/validators/required-field-validation'
import ValidationComposite from '@/validation/validators/validation-composite'
import EmailValidation from '@/validation/validators/email-validation'

const makeLoginValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    const fields = ['email', 'password']

    fields.forEach((field) => {
        validations.push(new RequiredFieldValidation(field))
    })

    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations)
}

export default makeLoginValidation
