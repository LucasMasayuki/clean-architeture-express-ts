import { AddUser, AddUserParams, AddUserResult } from '@/domain/usecases/add-user'

export default class AddUserSpy implements AddUser {
    constructor() {
        this.params = null
    }

    params: AddUserParams | null

    result = true

    async add(params: AddUserParams): Promise<AddUserResult> {
        this.params = params
        return this.result
    }
}
