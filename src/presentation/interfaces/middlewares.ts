import { HttpResponse } from '../helpers/http-helper'

export interface Middleware<T = any> {
  handle: (httpRequest: T) => Promise<HttpResponse>
}
