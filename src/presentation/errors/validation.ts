export class RequiredFieldError extends Error {
  constructor (fieldName?: string) {
    const message = fieldName === undefined
      ? 'Field required'
      : `The field ${fieldName} is required`
    super(message)
    this.name = 'RequiredFieldError'
  }
}

export class InvalidMimeTypeError extends Error {
  constructor (allowed: string[]) {
    super(`Unsupported file. Allowed extensions: ${allowed.join(', ')}`)
    this.name = 'InvalidMimeTypeError'
  }
}

export class MaxFileSizeError extends Error {
  constructor (maxSizeInMb: number) {
    super(`File upload limit is ${maxSizeInMb}MB`)
    this.name = 'MaxFileSizeError'
  }
}

export class InvalidCnpjError extends Error {
  constructor (cnpj: string) {
    super(`Invalid cnpj: ${cnpj}`)
    this.name = 'InvalidCnpjError'
  }
}

export class InvalidCpfError extends Error {
  constructor (cpf: string) {
    super(`Invalid cpf: ${cpf}`)
    this.name = 'InvalidCpfError'
  }
}

export class InvalidEmailError extends Error {
  constructor (email: string) {
    super(`Invalid email: ${email}`)
    this.name = 'InvalidEmailError'
  }
}
