import { InvalidCpfError } from '@/presentation/errors'

export class ValidateCpf {
  constructor (
    private readonly cpf: string
  ) {}

  validate (): Error | undefined {
    if (!this.isValidCpf()) return new InvalidCpfError(this.cpf)
  }

  private isValidCpf (): boolean {
    const replacedCpf = this.cpf.replace(/[.-]/g, '')
    const sameDigitsPattern = /^(.)\1*$/ // Regex for diferent digits

    if (sameDigitsPattern.test(replacedCpf)) {
      return false
    }

    let add = 0
    let rev

    for (let i = 0; i < 9; i += 1) {
      add += parseInt(replacedCpf.charAt(i), 10) * (10 - i)
      rev = 11 - (add % 11)
    }

    if (rev === 10 || rev === 11) {
      rev = 0
    }

    if (rev !== parseInt(replacedCpf.charAt(9), 10)) {
      return false
    }

    add = 0

    for (let i = 0; i < 10; i += 1) {
      add += parseInt(replacedCpf.charAt(i), 10) * (11 - i)
    }

    rev = 11 - (add % 11)

    if (rev === 10 || rev === 11) {
      rev = 0
    }

    if (rev !== parseInt(replacedCpf.charAt(10), 10)) {
      return false
    }

    return true
  }
}
