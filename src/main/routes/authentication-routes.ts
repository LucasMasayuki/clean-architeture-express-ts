import { Router } from 'express'
import adaptRoute from '@/main/adapters/routes-adapter'
import makeLoginController from '../factories/controllers/login-controller-factory'

const router = Router()

router.post('/api/v1/login', adaptRoute(makeLoginController()))

export default router
