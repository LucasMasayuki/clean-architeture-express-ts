import makeLogControllerDecorator from '@/main/factories/decorators/log-controller-decorator-factory'
import makeSignUpValidation from '@/main/factories/controllers/signup-validation-factory'
import makeDbAddUser from '@/main/factories/usecases/add-user-factory'
import makeDbAuthentication from '@/main/factories/usecases/authentication-factory'
import { SignUpController } from '@/presentation/controllers/signup-controller'
import { Controller } from '@/presentation/interfaces/controller'

const makeSignUpController = (): Controller => {
    const controller = new SignUpController(makeDbAddUser(), makeSignUpValidation(), makeDbAuthentication())
    return makeLogControllerDecorator(controller)
}

export default makeSignUpController
