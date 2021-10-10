import { User } from '@/infra/database/entities/user.entity'

export interface LoadUserByToken {
  load: (accessToken: string) => Promise<User | null>
}
