import adaptMiddleware from '@/main/adapters/express-middleware-adapter'
import { IocContainer } from '../ioc-containers/inversify.config'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'

const auth = adaptMiddleware(IocContainer.resolve(AuthMiddleware))
export default auth
