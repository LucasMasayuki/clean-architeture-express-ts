import LogErrorsRepository from '@/infra/database/repositories/log-errors/log-errors-repository'
import LogControllerDecorator from '@/main/decorators/log-controller-decorator'
import Controller from '@/presentation/controllers/controller'

const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logErrorRepository = new LogErrorsRepository()
  return new LogControllerDecorator(controller, logErrorRepository)
}

export default makeLogControllerDecorator
