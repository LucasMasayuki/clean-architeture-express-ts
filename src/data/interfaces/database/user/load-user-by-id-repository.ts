import { User } from '@/infra/database/entities/user.entity'

export interface LoadUserByIdRepository {
  loadById: (id: number) => Promise<User | undefined>
}
