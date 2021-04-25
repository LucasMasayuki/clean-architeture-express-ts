import { serverError } from '@/presentation/helpers/http-helper'
import { HttpResponse } from '@/presentation/interfaces/http-response'

const mockServerError = (): HttpResponse => {
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    return serverError(fakeError)
}

export default mockServerError
