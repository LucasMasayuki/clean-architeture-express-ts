import {
    AddUserRepository,
    AddUserRepositoryParams,
    AddUserRepositoryResult,
} from '@/data/interfaces/database/user/add-user-repository'

export default class AddUserRepositorySpy implements AddUserRepository {
    params: AddUserRepositoryParams | null

    constructor() {
        this.params = null
    }

    result = true

    async add(params: AddUserRepositoryParams): Promise<AddUserRepositoryResult> {
        this.params = params
        return this.result
    }
}
