/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Validation } from '@/presentation/interfaces/validation'
import MissingParamError from '@/presentation/errors/missing-params-error'

export default class RequiredFieldValidation implements Validation {
    private readonly fieldName: string

    constructor(fieldName: string) {
        this.fieldName = fieldName
    }

    public validate(input: any): Error | null {
        if (!input[this.fieldName]) {
            return new MissingParamError(this.fieldName)
        }

        return null
    }
}
