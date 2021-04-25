import { Params, Result } from '@/types/authentication'

export interface Authentication {
    auth: (authenticationParams: Params) => Promise<Result | null>
}
