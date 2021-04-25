import { Validation } from '@/presentation/interfaces/validation'
import InvalidParamError from '@/presentation/errors/invalid-param-error'

export default class CompareFieldsValidation implements Validation {
    private readonly fieldName: string

    private readonly fieldToCompareName: string

    constructor(fieldName: string, fieldToCompareName: string) {
        this.fieldName = fieldName
        this.fieldToCompareName = fieldToCompareName
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    validate(input: any): Error | null {
        if (input[this.fieldName] !== input[this.fieldToCompareName]) {
            return new InvalidParamError(this.fieldToCompareName)
        }

        return null
    }
}
