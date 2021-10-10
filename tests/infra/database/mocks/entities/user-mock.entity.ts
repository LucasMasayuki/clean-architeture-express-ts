import faker from 'faker'
import { User } from '@/infra/database/entities/user.entity'

export default class UserMock extends User {
  override id = faker.datatype.number()

  override firstName = faker.name.firstName()

  override lastName = faker.name.firstName()

  override email = faker.internet.email()

  override password = faker.internet.password()

  override birthDate = faker.date.recent()
}
