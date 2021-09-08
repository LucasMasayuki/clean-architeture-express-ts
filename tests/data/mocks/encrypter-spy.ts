import { Encrypter } from '@/data/interfaces/cryptography'
import faker from 'faker'

export default class EncrypterSpy implements Encrypter {
    ciphertext = faker.datatype.uuid()

    plaintext: string

    constructor(plaintext = '') {
        this.plaintext = plaintext
    }

    async encrypt(plaintext: string): Promise<string> {
        this.plaintext = plaintext
        return this.ciphertext
    }
}
