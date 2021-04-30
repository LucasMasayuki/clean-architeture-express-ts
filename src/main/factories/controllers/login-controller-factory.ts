import { Controller } from '@/presentation/interfaces/controller'
import { LoginController } from '@/presentation/controllers/login-controller'
import makeDbAuthentication from '../usecases/authentication-factory'
import makeLoginValidation from './login-validation-factory'
import makeLogControllerDecorator from '../decorators/log-controller-decorator-factory'

const makeLoginController = (): Controller => {
    const controller = new LoginController(makeDbAuthentication(), makeLoginValidation())
    return makeLogControllerDecorator(controller)
}

export default makeLoginController
