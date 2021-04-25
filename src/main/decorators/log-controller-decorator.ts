/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller } from '@/presentation/interfaces/controller'
import { HttpResponse } from '@/presentation/interfaces/http-response'
import { LogErrorRepository } from '@/data/interfaces/database/log/log-error-repository'
import HttpStatus from '@/shared/enums/httpStatus'

export default class LogControllerDecorator implements Controller {
    private readonly controller: Controller

    private readonly logErrorRepository: LogErrorRepository

    constructor(controller: Controller, logErrorRepository: LogErrorRepository) {
        this.controller = controller
        this.logErrorRepository = logErrorRepository
    }

    async handle(request: any): Promise<HttpResponse> {
        const httpResponse = await this.controller.handle(request)

        if (httpResponse.statusCode === HttpStatus.ERROR) {
            await this.logErrorRepository.logError(httpResponse.body.stack)
        }

        return httpResponse
    }
}
