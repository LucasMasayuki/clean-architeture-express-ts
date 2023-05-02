/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/first */

// Mocked need to be import first import the others dependencies
const mockUserAccountRepository = jest.fn()
// import makeApolloServer from '@/tests/main/graphql/helpers'

import { ApolloServer, gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'
import { mocked } from 'ts-jest/utils'
import jwt from 'jsonwebtoken'
import Sha256Adapter from '@/infra/cryptography/sha256-adapter'

// let apolloServer: ApolloServer

// jest.mock('@/infra/database/repositories/users-repository', () => {
//   return jest.fn().mockImplementation(() => {
//     return { loadByEmail: mockUserAccountRepository }
//   })
// })

// jest.mock('jsonwebtoken')
// jest.mock('bcrypt', () => ({
//   async hash (): Promise<string> {
//     return 'hash'
//   },

//   async compare (): Promise<boolean> {
//     return true
//   }
// }))

// describe('Login GraphQL', () => {
//   beforeAll(async () => {
//     apolloServer = makeApolloServer()
//   })

//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   afterAll(() => {
//     jest.restoreAllMocks()
//   })

//   describe('Login Query', () => {
//     beforeEach(async () => {
//       mocked(jwt).sign.mockImplementation(() => {
//         return 'test'
//       })
//     })

//     const loginQuery = gql`
//             query proLogin($email: String!, $password: String!) {
//                 proLogin(email: $email, password: $password) {
//                   auth {
//                     accessToken
//                     refreshTokenExpirationIn
//                     refreshToken
//                     expirationIn
//                     typeOfToken
//                     redirectTo
//                   }
//                 }
//             }
//         `

//     test('Should return an User on valid credentials', async () => {
//       const sha256Adapter = new Sha256Adapter()
//       const fakeUser = {
//         id: 'test',
//         name: 'test',
//         password: await sha256Adapter.hash('any_password'),
//         proUsersStores: [{
//           store: {
//             encodedName: 'test2',
//             brand: {
//               encodedName: 'test1'
//             }
//           }
//         }]
//       }

//       mockUserAccountRepository.mockReturnValue(fakeUser)

//       const { query } = createTestClient({ apolloServer })

//       const res: any = await query(loginQuery, {
//         variables: {
//           email: 'test@test.com',
//           password: 'any_password'
//         }
//       })

//       expect(res.data.proLogin.auth.accessToken).toBeTruthy()
//       expect(res.data.proLogin.auth.redirectTo).toBe(`${fakeUser.proUsersStores[0].store.brand.encodedName}/${fakeUser.proUsersStores[0].store.encodedName ?? ''}`)
//       expect(res.data.proLogin.auth.typeOfToken).toBe('bearer')
//     })

//     test('Should return UnauthorizedError on invalid credentials', async () => {
//       mockUserAccountRepository.mockReturnValue(undefined)

//       const { query } = createTestClient({ apolloServer })
//       const res: any = await query(loginQuery, {
//         variables: {
//           email: 'test@gmail.com',
//           password: '123'
//         }
//       })

//       expect(res.data).toBeFalsy()
//       expect(res.errors[0].message).toBe('Unauthorized')
//     })
//   })
// })
