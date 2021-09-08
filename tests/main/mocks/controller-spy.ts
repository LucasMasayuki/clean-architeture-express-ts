/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from '@/presentation/interfaces/controller'
import { HttpResponse } from '@/presentation/interfaces/http-response'
import { ok } from '@/presentation/helpers/http-helper'
import faker from 'faker'

export default class ControllerSpy implements Controller {
    httpResponse = ok(faker.datatype.uuid())

    request: any

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async handle(request: any): Promise<HttpResponse> {
        this.request = request
        return this.httpResponse
    }
}
