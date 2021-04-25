import adaptRoute from '@/main/adapters/routes-adapter'
import makeLoginController from '@/main/factories/login-controller-factory'

import { Router } from 'express'
import makeSignUpController from '../factories/controllers/signup-controller-factory'

const router = Router()

router.post('/api/v1/login', adaptRoute(makeLoginController()))
router.post('/api/v1/signup', adaptRoute(makeSignUpController()))

export default router
