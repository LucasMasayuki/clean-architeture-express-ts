import faker from '@/tests/helpers/faker'
import { Hasher } from '@/data/interfaces/cryptography'

export default class HasherSpy implements Hasher {
    digest = faker.uuid

    plaintext = ''

    async hash(plaintext: string): Promise<string> {
        this.plaintext = plaintext
        return this.digest
    }
}
