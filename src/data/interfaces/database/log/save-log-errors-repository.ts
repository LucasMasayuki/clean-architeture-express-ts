import { LogError } from '@/infra/database/entities/log-error.entity'

export interface SaveLogErrorsRepository {
  logError: (logError: LogError) => Promise<LogError | undefined>
}
