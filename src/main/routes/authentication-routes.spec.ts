/* eslint-disable import/first */

// Mocked need to be import first import the others dependencies
const mockLoadUserRepository = jest.fn()

import request from 'supertest'
import { mocked } from 'ts-jest/utils'

import jwt from 'jsonwebtoken'
import Sha256Adapter from '@/infra/cryptography/sha256-adapter'
import { HttpStatus } from '@/presentation/helpers/http-helper'
import { initializeApp } from '../config/app'

jest.mock('@/infra/database/repositories/users/load-users-repository', () => {
  return jest.fn().mockImplementation(() => {
    return { loadByEmail: mockLoadUserRepository }
  })
})

jest.mock('jsonwebtoken')

describe('Authentication Routes', () => {
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

      const app = await initializeApp()

      await request(app)
        .post('/api/v1/login')
        .send({
          email: 'any_email@gmail.com',
          password: 'any_password'
        })
        .expect(HttpStatus.OK)
    })

    it('Should return 401 on login', async () => {
      const app = await initializeApp()

      await request(app)
        .post('/api/v1/login')
        .send({
          email: 'test.test@gmail.com',
          password: '123'
        })
        .expect(HttpStatus.UNAUTHORIZED)
    })
  })
})
