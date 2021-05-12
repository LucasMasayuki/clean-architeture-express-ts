import faker from '@/tests/helpers/faker'
import { AddUserParams } from '@/domain/usecases/add-user'

const mockUserParams = (): AddUserParams => ({
    firstName: faker.name,
    birthDate: faker.time,
    lastName: faker.name,
    email: faker.email,
    password: faker.password,
})

export default mockUserParams
