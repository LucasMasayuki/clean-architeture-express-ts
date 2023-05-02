import { Router } from 'express'
import adaptRoute from '@/main/adapters/routes-adapter'
import { IocContainer } from '../ioc-containers/inversify.config'
import { LoginController } from '@/presentation/controllers/authentication/login-controller'

const router = Router()

router.post('/api/v1/login', adaptRoute(IocContainer.resolve(LoginController)))

export default router
