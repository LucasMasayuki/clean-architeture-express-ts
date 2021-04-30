import { AddUser, AddUserParams, AddUserResult } from '@/domain/usecases/add-user'
import { Hasher } from '@/data/interfaces/cryptography'
import { AddUserRepository } from '@/data/interfaces/database/user/add-user-repository'
import { CheckUserByEmailRepository } from '@/data/interfaces/database/user/check-user-by-email-repository'

export default class DbAddUser implements AddUser {
    private readonly hasher: Hasher

    private readonly addUserRepository: AddUserRepository

    private readonly checkUserByEmailRepository: CheckUserByEmailRepository

    constructor(
        hasher: Hasher,
        addUserRepository: AddUserRepository,
        checkUserByEmailRepository: CheckUserByEmailRepository,
    ) {
        this.hasher = hasher
        this.checkUserByEmailRepository = checkUserByEmailRepository
        this.addUserRepository = addUserRepository
    }

    async add(userData: AddUserParams): Promise<AddUserResult> {
        const exists = await this.checkUserByEmailRepository.checkByEmail(userData.email)

        let isValid = false
        if (!exists) {
            const hashedPassword = await this.hasher.hash(userData.password)
            isValid = await this.addUserRepository.add({ ...userData, password: hashedPassword })
        }

        return isValid
    }
}
