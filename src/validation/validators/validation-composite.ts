/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Validation } from '@/presentation/interfaces/validation'

export default class ValidationComposite implements Validation {
    private readonly validations: Validation[]

    constructor(validations: Validation[]) {
        this.validations = validations
    }

    public validate(input: any): Error | null {
        let error = null
        this.validations.every((validation: Validation) => {
            error = validation.validate(input)

            if (error) {
                return false
            }

            return true
        })

        return error
    }
}
