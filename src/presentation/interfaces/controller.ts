import { HttpResponse } from '@/presentation/interfaces/http-response'

export interface Controller<T = any> {
    handle: (request: T) => Promise<HttpResponse>
}
