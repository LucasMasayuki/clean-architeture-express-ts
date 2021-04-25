import { Decrypter, Encrypter } from '@/data/interfaces/cryptography'
import jwt from 'jsonwebtoken'

export default class JwtAdapter implements Encrypter, Decrypter {
    private readonly secret: string

    constructor(secret: string) {
        this.secret = secret
    }

    async encrypt(plaintext: string): Promise<string> {
        return jwt.sign({ id: plaintext }, this.secret)
    }

    async decrypt(ciphertext: string): Promise<string> {
        return jwt.verify(ciphertext, this.secret) as string
    }
}
