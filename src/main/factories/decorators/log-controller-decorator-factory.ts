import LogControllerDecorator from '@/main/decorators/log-controller-decorator'
import LogMongoRepository from '@/infra/database/mongodb/repositories/log-mongo-repository'
import { Controller } from '@/presentation/interfaces/controller'

const makeLogControllerDecorator = (controller: Controller): Controller => {
    const logMongoRepository = new LogMongoRepository()
    return new LogControllerDecorator(controller, logMongoRepository)
}

export default makeLogControllerDecorator
