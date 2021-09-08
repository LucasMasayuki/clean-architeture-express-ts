import { Params } from '@/types/authentication'
import faker from 'faker'

const mockAuthenticationParams = (): Params => ({
    email: faker.internet.email(),
    password: faker.internet.password(),
})

export default mockAuthenticationParams
