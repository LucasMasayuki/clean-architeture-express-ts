import { LoginController } from '@/presentation/controllers/authentication/login-controller'
import Controller from '@/presentation/controllers/controller'
import makeLogControllerDecorator from './decorators/log-controller-decorator-factory'
import makeDbAuthentication from './usecases/authentication-factory'

const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}

export default makeLoginController
