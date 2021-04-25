/* eslint-disable class-methods-use-this */
import { EmailValidator } from '@/validation/interfaces/email-validator'

import validator from 'validator'

export default class EmailValidatorAdapter implements EmailValidator {
    isValid(email: string): boolean {
        return validator.isEmail(email)
    }
}
