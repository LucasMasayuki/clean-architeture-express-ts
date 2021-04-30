import adaptMiddleware from '@/main/adapters/express-middleware-adapter'
import makeAuthMiddleware from '@/main/factories/middlewares/auth-middlewares-factory'

const auth = adaptMiddleware(makeAuthMiddleware())
export default auth
