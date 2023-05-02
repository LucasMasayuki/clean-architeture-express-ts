import { Validation } from '@/presentation/interfaces/validation'
import { injectable } from 'inversify'

@injectable()
export default class ValidationSpy implements Validation {
  error: Error | null = null

  input: any

  validate (input: any): Error | null {
    this.input = input
    return this.error
  }
}
