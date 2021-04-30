import makeDbLoadUserByToken from '@/main/factories/usecases/load-user-by-token-factory'
import { Middleware } from '@/presentation/interfaces/middlewares'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'

const makeAuthMiddleware = (): Middleware => {
    return new AuthMiddleware(makeDbLoadUserByToken())
}

export default makeAuthMiddleware
