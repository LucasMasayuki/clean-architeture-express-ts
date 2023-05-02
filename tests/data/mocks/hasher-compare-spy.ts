import { HashComparer } from '@/data/interfaces/cryptography'
import { injectable } from 'inversify'

@injectable()
export default class HashComparerSpy implements HashComparer {
  plaintext: string

  digest: string

  isValid = true

  constructor (plainText = '', digest = '') {
    this.plaintext = plainText
    this.digest = digest
  }

  async compare (plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext
    this.digest = digest
    return this.isValid
  }
}
