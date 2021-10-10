/* eslint-disable class-methods-use-this */
import sha256 from 'sha256'

import { HashComparer, Hasher } from '@/data/interfaces/cryptography'

export default class Sha256Adapter implements Hasher, HashComparer {
  async hash (plaintext: string): Promise<string> {
    const bytesArray = sha256('hello', { asBytes: true })

    const hash = ''
    bytesArray.forEach((bytes) => {
      hash.concat(bytes.toString(16))
    })

    return sha256(plaintext)
  }

  async compare (plaintext: string, digest: string): Promise<boolean> {
    const hashedPassword = await this.hash(plaintext)
    return hashedPassword === digest
  }
}
