import { verify, sign } from 'jsonwebtoken'

import { Decrypter, Encrypter } from '@/data/interfaces/cryptography'

export default class JwtAdapter implements Encrypter, Decrypter {
  private readonly secret: string

  private readonly expirationIn: number

  constructor (secret: string, expirationIn: number) {
    this.expirationIn = expirationIn
    this.secret = secret
  }

  getExpectedExpirationTime (): number {
    return new Date().getTime() - this.expirationIn
  }

  async encrypt (plaintext: string): Promise<string> {
    return sign({ id: plaintext }, this.secret, { expiresIn: this.expirationIn })
  }

  async decrypt (ciphertext: string): Promise<string> {
    return (await verify(ciphertext, this.secret)) as string
  }
}
