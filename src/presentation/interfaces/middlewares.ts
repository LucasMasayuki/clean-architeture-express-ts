import { HttpResponse } from '@/presentation/interfaces/http-response'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Middleware<T = any> {
    handle: (httpRequest: T) => Promise<HttpResponse>
}
