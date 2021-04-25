export type AddUserParams = {
    name: string
    email: string
    password: string
}

export type AddUserResult = boolean

export interface AddUser {
    add: (account: AddUserParams) => Promise<AddUserResult>
}
