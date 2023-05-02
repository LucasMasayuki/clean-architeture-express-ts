export type AddUserParams = {
  firstName: string
  lastName: string
  birthDate: Date
  email: string
  password: string
}

export type AddUserResult = boolean

export interface AddUser {
  add: (user: AddUserParams) => Promise<AddUserResult>
}
