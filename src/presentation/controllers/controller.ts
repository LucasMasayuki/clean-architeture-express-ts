import { ValidationComposite, Validator } from '@/validation/validators'
import { badRequest, HttpResponse, serverError } from '../helpers/http-helper'

export default abstract class Controller {
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
      console.log(error)
      return serverError(error)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
