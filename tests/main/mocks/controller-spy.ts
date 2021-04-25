import { Controller } from '@/presentation/interfaces/controller'
import { HttpResponse } from '@/presentation/interfaces/http-response'
import { ok } from '@/presentation/helpers/http-helper'
import faker from '@/tests/helpers/faker'

export default class ControllerSpy implements Controller {
    httpResponse = ok(faker.uuid)

    request: any

    async handle(request: any): Promise<HttpResponse> {
        this.request = request
        return this.httpResponse
    }
}
