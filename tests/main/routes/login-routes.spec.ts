/* eslint-disable import/first */

// Mocked need to be import first import the others dependencies
const mockLoadUserRepository = jest.fn()

import request from 'supertest'
import { mocked } from 'ts-jest/utils'

import App from '@/main/config/app'
import AuthenticationRoutes from '@/main/routes/authentication-routes'
import jwt from 'jsonwebtoken'
import Sha256Adapter from '@/infra/cryptography/sha256-adapter'
import { HttpStatus } from '@/presentation/helpers/http-helper'

jest.mock('@/infra/database/repositories/users/load-users-repository', () => {
  return jest.fn().mockImplementation(() => {
    return { loadByEmail: mockLoadUserRepository }
  })
})

jest.mock('jsonwebtoken')

describe('Login Routes', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /login', () => {
    it('Should return 200 on login', async () => {
      const sha256Adapter = new Sha256Adapter()
      const fakeUser = {
        id: 'test',
        name: 'test',
        password: await sha256Adapter.hash('any_password')
      }

      mockLoadUserRepository.mockReturnValue(fakeUser)

      mocked(jwt).sign.mockImplementation(() => {
        return 'test'
      })

      const routers = [AuthenticationRoutes]
      const app = new App(routers, 3000)

      await request(app.getServer())
        .post('/api/v1/login')
        .send({
          email: 'any_email@gmail.com',
          password: 'any_password'
        })
        .expect(HttpStatus.OK)
    })

    it('Should return 401 on login', async () => {
      const routers = [AuthenticationRoutes]
      const app = new App(routers, 3000)

      await request(app.getServer())
        .post('/api/v1/login')
        .send({
          email: 'test.test@gmail.com',
          password: '123'
        })
        .expect(HttpStatus.UNAUTHORIZED)
    })
  })
})
