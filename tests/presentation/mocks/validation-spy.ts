/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Validation } from '@/presentation/interfaces/validation'

export default class ValidationSpy implements Validation {
    error: Error | null = null

    input: any

    validate(input: any): Error | null {
        this.input = input
        return this.error
    }
}
