
import { User } from '@/infra/database/entities/user.entity'

export interface LoadUserByEmailRepository {
  loadByEmail: (email: string) => Promise<User | undefined>
}
