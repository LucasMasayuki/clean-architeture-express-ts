/* eslint-disable import/first */

// Mocked need to be import first import the others dependencies
const mockLoadUserRepository = jest.fn()

import makeApolloServer from '@/tests/main/graphql/helpers'

import { ApolloServer, gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'
import { mocked } from 'ts-jest/utils'
import jwt from 'jsonwebtoken'
import Sha256Adapter from '@/infra/cryptography/sha256-adapter'

let apolloServer: ApolloServer

jest.mock('@/infra/database/repositories/users/load-users-repository', () => {
  return jest.fn().mockImplementation(() => {
    return { loadByEmail: mockLoadUserRepository }
  })
})

jest.mock('jsonwebtoken')
jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hash'
  },

  async compare (): Promise<boolean> {
    return true
  }
}))

describe('Login GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Login Query', () => {
    beforeEach(async () => {
      mocked(jwt).sign.mockImplementation(() => {
        return 'test'
      })
    })

    const loginQuery = gql`
            query login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    auth {
                      accessToken
                    }
                }
            }
        `
    test('Should return an User on valid credentials', async () => {
      const sha256Adapter = new Sha256Adapter()
      const fakeUser = {
        id: 'test',
        name: 'test',
        password: await sha256Adapter.hash('any_password')
      }

      mockLoadUserRepository.mockReturnValue(fakeUser)

      const { query } = createTestClient({ apolloServer })

      const res: any = await query(loginQuery, {
        variables: {
          email: 'test@test.com',
          password: 'any_password'
        }
      })

      expect(res.data.login.auth.accessToken).toBeTruthy()
    })

    test('Should return UnauthorizedError on invalid credentials', async () => {
      mockLoadUserRepository.mockReturnValue(undefined)

      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery, {
        variables: {
          email: 'test@gmail.com',
          password: '123'
        }
      })

      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Unauthorized')
    })
  })
})
