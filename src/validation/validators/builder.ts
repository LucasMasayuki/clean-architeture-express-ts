/* eslint-disable valid-typeof */
import { Validator, AllowedMimeTypes, Extension, MaxFileSize, Required, RequiredBuffer, RequiredString, RequiredArray } from '@/validation/validators'
import { ValidateCnpj } from './cnpj'
import { ValidateCpf } from './cpf'
import { ValidateEmail } from './email'

export class ValidationBuilder {
  private constructor (
    private readonly value: any,
    private readonly fieldName?: string,
    private readonly validators: Validator[] = []
  ) {}

  static of ({ value, fieldName }: { value: any, fieldName?: string }): ValidationBuilder {
    return new ValidationBuilder(value, fieldName)
  }

  required (): ValidationBuilder {
    if (this.value instanceof Buffer) {
      this.validators.push(new RequiredBuffer(this.value, this.fieldName))
    } else if (typeof this.value === 'string') {
      this.validators.push(new RequiredString(this.value, this.fieldName))
    } else if (Array.isArray(this.value)) {
      this.validators.push(new RequiredArray(this.value, this.fieldName))
    } else {
      this.validators.push(new Required(this.value, this.fieldName))
      if (this.value.buffer !== undefined) {
        this.validators.push(new RequiredBuffer(this.value.buffer, this.fieldName))
      }
    }
    return this
  }

  image ({ allowed, maxSizeInMb }: { allowed: Extension[], maxSizeInMb: number }): ValidationBuilder {
    if (this.value.mimeType !== undefined) {
      this.validators.push(new AllowedMimeTypes(allowed, this.value.mimeType))
    }
    if (this.value.buffer !== undefined) {
      this.validators.push(new MaxFileSize(maxSizeInMb, this.value.buffer))
    }
    return this
  }

  cnpj (): ValidationBuilder {
    this.validators.push(new ValidateCnpj(this.value))
    return this
  }

  cpf (): ValidationBuilder {
    this.validators.push(new ValidateCpf(this.value))
    return this
  }

  email (): ValidationBuilder {
    this.validators.push(new ValidateEmail(this.value))
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
