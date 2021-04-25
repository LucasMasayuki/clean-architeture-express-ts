/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Validation } from '@/presentation/interfaces/validation'
import InvalidParamError from '@/presentation/errors/invalid-param-error'
import { EmailValidator } from '../interfaces/email-validator'

export default class EmailValidation implements Validation {
    private readonly fieldName: string

    private readonly emailValidator: EmailValidator

    constructor(fieldName: string, emailValidator: EmailValidator) {
        this.fieldName = fieldName
        this.emailValidator = emailValidator
    }

    public validate(input: any): Error | null {
        const isValid = this.emailValidator.isValid(input[this.fieldName])
        if (!isValid) {
            return new InvalidParamError(this.fieldName)
        }

        return null
    }
}
