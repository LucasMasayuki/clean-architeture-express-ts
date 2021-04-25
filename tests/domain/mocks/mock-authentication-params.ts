import { Params } from '@/types/authentication'
import faker from '@/tests/helpers/faker'

const mockAuthenticationParams = (): Params => ({
    email: faker.email,
    password: faker.password,
})

export default mockAuthenticationParams
