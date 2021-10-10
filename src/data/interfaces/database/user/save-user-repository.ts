import { User } from '@/infra/database/entities/user.entity'

export interface SaveUserRepository {
  saveUser: (user: User) => Promise<User | undefined>
}
