import { LoginController } from '@/presentation/controllers/authentication/login-controller'
import Controller from '@/presentation/controllers/controller'
import makeDbAuthentication from '../usecases/authentication-factory'

const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication())
  return controller
}

export default makeLoginController
