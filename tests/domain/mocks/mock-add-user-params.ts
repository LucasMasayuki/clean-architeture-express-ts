import faker from 'faker'
import { AddUserParams } from '@/domain/usecases/add-user'

const mockUserParams = (): AddUserParams => ({
  firstName: faker.name.firstName(),
  birthDate: faker.date.recent(),
  lastName: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export default mockUserParams
