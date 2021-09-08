import { AddUserParams } from '@/domain/usecases/add-user'
import faker from 'faker'

const mockUserParams = (): AddUserParams => ({
    firstName: faker.name.firstName(),
    birthDate: faker.date.recent(),
    lastName: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
})

export default mockUserParams
