/* eslint-disable class-methods-use-this */

import { SaveLogErrorsRepository } from '@/data/interfaces/database/log/save-log-errors-repository'
import { LogError } from '../../entities/log-error.entity'
import DbRepository from '../db-repository'

export default class LogErrorsRepository
  extends DbRepository
  implements SaveLogErrorsRepository {
  async logError (log: LogError): Promise<LogError | undefined> {
    const userRepository = this.getRepository(LogError)
    return await userRepository.save(log)
  }
}
