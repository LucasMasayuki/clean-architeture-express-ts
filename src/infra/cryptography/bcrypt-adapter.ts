import bcrypt from 'bcrypt'

import { HashComparer, Hasher } from '@/data/interfaces/cryptography'

export default class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, this.salt)
  }

  // eslint-disable-next-line class-methods-use-this
  async compare (plaintext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaintext, digest)
  }
}
