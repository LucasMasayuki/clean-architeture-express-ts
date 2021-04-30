import makeApolloServer from '@/tests/main/graphql/helpers'
import MongoHelper from '@/infra/database/mongodb/mongodb'

import { ApolloServer, gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'
import { mocked } from 'ts-jest/utils'
import MockDb from '@/tests/infra/database/mongodb/mocks/mock-db'
import MockClient from '@/tests/infra/database/mongodb/mocks/mock-client'
import BcryptAdapter from '@/infra/cryptography/bcrypt-adapter'
import MockCollection from '@/tests/infra/database/mongodb/mocks/mock-collection'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

let apolloServer: ApolloServer

jest.mock('@/infra/database/mongodb/mongodb')
jest.mock('jsonwebtoken')
jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return 'hash'
    },

    async compare(): Promise<boolean> {
        return true
    },
}))

const fakeUser = {
    id: 'test',
    firstName: 'test',
    lastName: 'tset',
    password: 'test',
}

let mockDb: MockDb
let mockClient: MockClient
let mockCollection: MockCollection

describe('Login GraphQL', () => {
    beforeAll(async () => {
        apolloServer = makeApolloServer()
    })

    beforeEach(() => {
        mocked(MongoHelper).getDatabase.mockClear()
        mocked(jwt).sign.mockClear()
        mockDb = new MockDb()
        mockClient = new MockClient('test')
        mockCollection = new MockCollection()
    })

    describe('Login Query', () => {
        beforeEach(async () => {
            mockClient.connect.mockImplementation(async () => MockClient)

            mockDb.collection.mockImplementation(() => mockCollection)

            mocked(MongoHelper).getDatabase.mockImplementation(async () => {
                return mockDb
            })

            mocked(MongoHelper).map.mockImplementation(async () => {
                return fakeUser
            })

            mocked(jwt).sign.mockImplementation(async () => {
                return 'test'
            })
        })

        const loginQuery = gql`
            query login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    accessToken
                    name
                }
            }
        `
        test('Should return an User on valid credentials', async () => {
            mockCollection.findOne.mockImplementation(() => fakeUser)
            mockCollection.updateOne.mockImplementation(() => {
                return { ops: ['test'] }
            })

            const { query } = createTestClient({ apolloServer })

            const res: any = await query(loginQuery, {
                variables: {
                    email: 'test@test.com',
                    password: 'test',
                },
            })

            expect(res.data.login.accessToken).toBeTruthy()
            expect(res.data.login.name).toBe('test tset')
        })

        test('Should return UnauthorizedError on invalid credentials', async () => {
            mockCollection.findOne.mockImplementation(() => null)

            const { query } = createTestClient({ apolloServer })
            const res: any = await query(loginQuery, {
                variables: {
                    email: 'test@gmail.com',
                    password: '123',
                },
            })
            console.log(res)

            expect(res.data).toBeFalsy()
            expect(res.errors[0].message).toBe('Unauthorized')
        })
    })

    describe('SignUp Mutation', () => {
        beforeEach(() => {
            mockClient.connect.mockImplementation(async () => MockClient)

            mockDb.collection.mockImplementation(() => mockCollection)

            mocked(MongoHelper).getDatabase.mockImplementation(async () => {
                return mockDb
            })

            mocked(MongoHelper).map.mockImplementation(async () => {
                return fakeUser
            })

            mocked(jwt).sign.mockImplementation(async () => {
                return 'test'
            })
        })

        const signUpMutation = gql`
            mutation signUp(
                $firstName: String!
                $lastName: String!
                $birthDate: DateTime!
                $email: String!
                $password: String!
                $passwordConfirmation: String!
            ) {
                signUp(
                    firstName: $firstName
                    lastName: $lastName
                    email: $email
                    birthDate: $birthDate
                    password: $password
                    passwordConfirmation: $passwordConfirmation
                ) {
                    accessToken
                    name
                }
            }
        `

        test('Should return an User on valid data', async () => {
            mockCollection.findOne.mockReturnValueOnce(null).mockReturnValueOnce(fakeUser)
            mockCollection.insertOne.mockImplementation(() => {
                return { ops: ['test'] }
            })

            const { mutate } = createTestClient({ apolloServer })
            const res: any = await mutate(signUpMutation, {
                variables: {
                    firstName: 'Test',
                    lastName: 'Test',
                    email: 'test@test.com',
                    password: 'test',
                    passwordConfirmation: 'test',
                    birthDate: new Date(),
                },
            })

            expect(res.data.signUp.accessToken).toBeTruthy()
            expect(res.data.signUp.name).toBe('test tset')
        })

        test('Should return EmailInUseError on invalid data', async () => {
            mockCollection.findOne.mockImplementation(() => fakeUser)
            mockCollection.insertOne.mockImplementation(() => {
                return { ops: ['test'] }
            })

            const { mutate } = createTestClient({ apolloServer })
            const res: any = await mutate(signUpMutation, {
                variables: {
                    firstName: 'Test',
                    lastName: 'Test',
                    email: 'test@test.com',
                    password: 'test',
                    passwordConfirmation: 'test',
                    birthDate: new Date(),
                },
            })

            expect(res.data).toBeFalsy()
            expect(res.errors[0].message).toBe('The received email is already in use')
        })
    })
})
