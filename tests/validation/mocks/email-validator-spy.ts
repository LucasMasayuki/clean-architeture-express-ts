import { EmailValidator } from '@/validation/interfaces/email-validator'

export default class EmailValidatorSpy implements EmailValidator {
    isEmailValid = true

    email: string

    constructor(email = '') {
        this.email = email
    }

    isValid(email: string): boolean {
        this.email = email
        return this.isEmailValid
    }
}
