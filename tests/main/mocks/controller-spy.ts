/* eslint-disable @typescript-eslint/no-explicit-any */
import faker from 'faker'

import { HttpResponse, ok } from '@/presentation/helpers/http-helper'
import Controller from '@/presentation/controllers/controller'

export default class ControllerSpy extends Controller {
  httpResponse = ok(faker.datatype.uuid())

  request: any

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async perform (request: any): Promise<HttpResponse> {
    this.request = request
    return this.httpResponse
  }
}
