import { AddUserParams } from '@/domain/usecases/add-user'

export type AddUserRepositoryParams = AddUserParams
export type AddUserRepositoryResult = boolean

export interface AddUserRepository {
    add: (data: AddUserRepositoryParams) => Promise<AddUserRepositoryResult>
}
