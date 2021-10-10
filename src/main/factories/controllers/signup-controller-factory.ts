import makeLogControllerDecorator from '@/main/factories/decorators/log-controller-decorator-factory'
import makeDbAddUser from '@/main/factories/usecases/add-user-factory'
import makeDbAuthentication from '@/main/factories/usecases/authentication-factory'
import { SignUpController } from '@/presentation/controllers/authentication/signup-controller'
import Controller from '@/presentation/controllers/controller'

const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddUser(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}

export default makeSignUpController
