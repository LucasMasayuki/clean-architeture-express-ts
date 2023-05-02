import logger from '@/infra/gateways/winston-logger'
import { ValidationComposite, Validator } from '@/validation/validators'
import { injectable } from 'inversify'
import { badRequest, HttpResponse, serverError, unprocessableEntity } from '../helpers/http-helper'

@injectable()
export abstract class Controller {
  abstract perform (httpRequest: any): Promise<HttpResponse>

  buildValidators (httpRequest: any): Validator[] {
    return []
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      const error = this.validate(httpRequest)

      if (error !== undefined) return badRequest(error)

      return await this.perform(httpRequest)
    } catch (error) {
      if ((error as Error).name === 'UnprocessableEntityError') {
        return unprocessableEntity(error)
      }

      logger.error(error)

      return serverError(error)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
