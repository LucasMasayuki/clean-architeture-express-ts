import { InvalidCnpjError } from '@/presentation/errors'

export class ValidateCnpj {
  constructor (
    private readonly cnpj: string
  ) {}

  validate (): Error | undefined {
    if (!this.isValidCnpj()) return new InvalidCnpjError(this.cnpj)
  }

  private isValidCnpj (): boolean {
    const cnpj = this.cnpj.replace(/[^\d]+/g, '')

    if (cnpj === '') return false

    if (cnpj.length !== 14) {
      return false
    }

    // Elimina CNPJs invalidos conhecidos
    if (
      cnpj === '00000000000000' ||
      cnpj === '11111111111111' ||
      cnpj === '22222222222222' ||
      cnpj === '33333333333333' ||
      cnpj === '44444444444444' ||
      cnpj === '55555555555555' ||
      cnpj === '66666666666666' ||
      cnpj === '77777777777777' ||
      cnpj === '88888888888888' ||
      cnpj === '99999999999999'
    ) {
      return false
    }

    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho)
    const digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7
    let i
    for (i = tamanho; i >= 1; i -= 1) {
      soma += parseInt(numeros.charAt(tamanho - i), 10) * pos
      pos -= 1
      if (pos < 2) {
        pos = 9
      }
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado.toString() !== digitos.charAt(0)) {
      return false
    }

    tamanho += 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7
    for (i = tamanho; i >= 1; i -= 1) {
      soma += parseInt(numeros.charAt(tamanho - i), 10) * pos
      pos -= 1
      if (pos < 2) {
        pos = 9
      }
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado.toString() !== digitos.charAt(1)) {
      return false
    }

    return true
  }
}
