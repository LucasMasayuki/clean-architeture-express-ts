import { InvalidEmailError } from '@/presentation/errors'

export class ValidateEmail {
  constructor (
    private readonly email: string
  ) {}

  validate (): Error | undefined {
    if (!this.isValidEmail()) return new InvalidEmailError(this.email)
  }

  private isValidEmail (): boolean {
    const re =
      /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/
    return re.test(this.email)
  }
}
