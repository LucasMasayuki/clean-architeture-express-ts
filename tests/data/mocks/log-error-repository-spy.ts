import { LogError } from '@/infra/database/entities/log-error.entity'
import { SaveLogErrorsRepository } from '../interfaces/database/log/save-log-errors-repository'
import { injectable } from 'inversify'

@injectable()
export default class LogErrorRepositorySpy implements SaveLogErrorsRepository {
  logErrorEntity: LogError | undefined

  async logError (entity: LogError): Promise<LogError | undefined> {
    this.logErrorEntity = entity

    return this.logErrorEntity
  }
}
