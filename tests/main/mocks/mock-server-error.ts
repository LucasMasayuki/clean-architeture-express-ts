import { HttpResponse, serverError } from '@/presentation/helpers/http-helper'

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

export default mockServerError
