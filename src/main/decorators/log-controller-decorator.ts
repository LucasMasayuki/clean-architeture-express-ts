import HttpStatus from '@/shared/enums/httpStatus'
import { HttpResponse } from '@/presentation/helpers/http-helper'
import { SaveLogErrorsRepository } from '@/data/interfaces/database/log/save-log-errors-repository'
import { LogError } from '@/infra/database/entities/log-error.entity'
import { Controller } from '@/presentation/controllers/controller'

export default class LogControllerDecorator extends Controller {
  constructor (private readonly controller: Controller, private readonly logErrorRepository: SaveLogErrorsRepository) {
    super()
  }

  async perform (request: any): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(request)

    if (httpResponse.statusCode === HttpStatus.ERROR) {
      const logError = new LogError()
      logError.stack = httpResponse.data.stack

      await this.logErrorRepository.logError(logError)
    }

    return httpResponse
  }
}
