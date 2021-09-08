import { Hasher } from '@/data/interfaces/cryptography'
import faker from 'faker'

export default class HasherSpy implements Hasher {
    digest = faker.datatype.uuid()

    plaintext = ''

    async hash(plaintext: string): Promise<string> {
        this.plaintext = plaintext
        return this.digest
    }
}
