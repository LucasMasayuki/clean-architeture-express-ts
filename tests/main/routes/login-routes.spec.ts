import MongoHelper from '@/infra/database/mongodb/mongodb'

import request from 'supertest'
import { mocked } from 'ts-jest/utils'
import MockDb from '@/tests/infra/database/mongodb/mocks/mock-db'
import MockClient from '@/tests/infra/database/mongodb/mocks/mock-client'
import HttpStatus from '@/shared/enums/httpStatus'
import App from '@/main/config/app'
import LoginRoutes from '@/main/routes/login-routes'
import BcryptAdapter from '@/infra/cryptography/bcrypt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('@/infra/database/mongodb/mongodb')
jest.mock('jsonwebtoken')

describe('Login Routes', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('POST /login', () => {
        test('Should return 200 on login', async () => {
            const salt = 12
            const bcryptAdapter = new BcryptAdapter(salt)
            const fakeUser = {
                id: 'test',
                name: 'test',
                password: await bcryptAdapter.hash('test'),
            }

            const mockDb = new MockDb()
            const mockClient = new MockClient('test')

            mockClient.connect.mockImplementation(async () => MockClient)
            mockDb.findOne.mockImplementation(() => fakeUser)
            mockDb.collection.mockImplementation(() => mockDb)

            mocked(MongoHelper).getDatabase.mockImplementation(async () => {
                return mockDb
            })

            mocked(MongoHelper).map.mockImplementation(async () => {
                return fakeUser
            })

            mocked(jwt).sign.mockImplementation(async () => {
                return 'test'
            })

            const routers = [LoginRoutes]
            const app = new App(routers, 3000)

            await request(app.getServer())
                .post('/api/v1/login')
                .send({
                    email: 'lucasmasayuki@gmail.com',
                    password: 'test',
                })
                .expect(HttpStatus.OK)
        })

        test('Should return 401 on login', async () => {
            const routers = [LoginRoutes]
            const app = new App(routers, 3000)

            await request(app.getServer())
                .post('/api/v1/login')
                .send({
                    email: 'test.test@gmail.com',
                    password: '123',
                })
                .expect(HttpStatus.UNAUTHORIZED)
        })
    })

    describe('POST /signup', () => {
        test('Should return 200 on signup', async () => {
            const mockDb = new MockDb()
            const mockClient = new MockClient('test')

            mockClient.connect.mockImplementation(async () => MockClient)
            mockDb.findOne.mockImplementation(() => null)
            mockDb.insertOne.mockImplementation(() => {
                return { ops: ['test'] }
            })
            mockDb.collection.mockImplementation(() => mockDb)

            mocked(MongoHelper).getDatabase.mockImplementation(async () => {
                return mockDb
            })

            const routers = [LoginRoutes]
            const app = new App(routers, 3000)

            await request(app.getServer())
                .post('/api/v1/signup')
                .send({
                    firstName: 'Lucas',
                    lastName: 'Masayuki',
                    birthDate: new Date(),
                    email: 'lucas@gmail.com',
                    password: '123',
                    passwordConfirmation: '123',
                })
                .expect(200)
        })

        test('Should return 403 on signup', async () => {
            const salt = 12
            const bcryptAdapter = new BcryptAdapter(salt)
            const fakeUser = {
                id: 'test',
                name: 'test',
                password: await bcryptAdapter.hash('test'),
            }

            const mockDb = new MockDb()
            const mockClient = new MockClient('test')

            mockClient.connect.mockImplementation(async () => MockClient)
            mockDb.findOne.mockImplementation(() => fakeUser)
            mockDb.collection.mockImplementation(() => mockDb)

            mocked(MongoHelper).getDatabase.mockImplementation(async () => {
                return mockDb
            })

            const routers = [LoginRoutes]
            const app = new App(routers, 3000)

            await request(app.getServer())
                .post('/api/v1/signup')
                .send({
                    firstName: 'Lucas',
                    lastName: 'Masayuki',
                    birthDate: new Date(),
                    email: 'lucas@gmail.com',
                    password: '123',
                    passwordConfirmation: '123',
                })
                .expect(403)
        })
    })
})
