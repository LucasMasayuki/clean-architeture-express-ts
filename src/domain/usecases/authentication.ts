export type AuthenticationParams = {
  email: string
  password: string
}

export type AuthenticationResult = {
  accessToken: string
  typeOfToken: string
  expiratesIn: number
}

export interface Authentication {
  auth: (authenticationParams: AuthenticationParams) => Promise<AuthenticationResult | null>
}
