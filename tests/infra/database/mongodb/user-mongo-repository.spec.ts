import UserMongoRepository from '@/infra/database/mongodb/repositories/user-mongo-repository'
import MongoHelper from '@/infra/database/mongodb/mongodb'

import { mocked } from 'ts-jest/utils'
import MockDb from '@/tests/infra/database/mongodb/mocks/mock-db'
import MockClient from '@/tests/infra/database/mongodb/mocks/mock-client'
import faker from '@/tests/helpers/faker'
import mockAddUserParams from '@/tests/domain/mocks/mock-add-user-params'
import { verify } from 'jsonwebtoken'
import MockCollection from './mocks/mock-collection'

jest.mock('@/infra/database/mongodb/mongodb')

const getFakeUserRepository = (): UserMongoRepository => {
    return new UserMongoRepository()
}

describe('UserMongoRepository', () => {
    beforeAll(async () => {
        mocked(MongoHelper).getDatabase.mockClear()
    })

    describe('loadByEmail()', () => {
        test('Should return an User on success', async () => {
            const fakeUser = {
                id: 'test',
                firstName: 'test',
                lastName: 'test',
                password: 'test',
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

            const UserRepository = getFakeUserRepository()
            const user = await UserRepository.loadByEmail(faker.email)

            expect(user).toBeTruthy()
            expect(user.id).toBeTruthy()
            expect(user.firstName).toBe(fakeUser.firstName)
            expect(user.password).toBe(fakeUser.password)
        })

        test('Should return null if loadByEmail fails', async () => {
            const mockDb = new MockDb()
            const mockClient = new MockClient('test')

            mockClient.connect.mockImplementation(async () => MockClient)
            mockDb.findOne.mockImplementation(() => null)
            mockDb.collection.mockImplementation(() => mockDb)

            mocked(MongoHelper).getDatabase.mockImplementation(async () => {
                return mockDb
            })

            mocked(MongoHelper).map.mockImplementation(async () => {
                return null
            })

            const UserRepository = getFakeUserRepository()
            const user = await UserRepository.loadByEmail(faker.email)

            expect(user).toBeFalsy()
        })
    })

    describe('add()', () => {
        test('Should return an User on success', async () => {
            const mockDb = new MockDb()
            const mockClient = new MockClient('test')

            mockClient.connect.mockImplementation(async () => MockClient)
            mockDb.findOne.mockImplementation(() => null)
            mockDb.collection.mockImplementation(() => mockDb)
            mockDb.insertOne.mockImplementation(() => {
                return { ops: ['test'] }
            })

            mocked(MongoHelper).getDatabase.mockImplementation(async () => {
                return mockDb
            })

            const addUserParams = mockAddUserParams()
            const UserRepository = getFakeUserRepository()
            const isValid = await UserRepository.add(addUserParams)

            expect(isValid).toBe(true)
        })
    })

    describe('checkByEmail()', () => {
        test('Should return true if email is valid', async () => {
            const mockDb = new MockDb()
            const mockClient = new MockClient('test')

            mockClient.connect.mockImplementation(async () => MockClient)
            mockDb.collection.mockImplementation(() => mockDb)
            mockDb.findOne.mockImplementation(() => {
                return { ops: ['test'] }
            })

            mocked(MongoHelper).getDatabase.mockImplementation(async () => {
                return mockDb
            })

            const addUserParams = mockAddUserParams()

            const UserRepository = getFakeUserRepository()
            const exists = await UserRepository.checkByEmail(addUserParams.email)

            expect(exists).toBe(true)
        })

        test('Should return false if email is not valid', async () => {
            const mockDb = new MockDb()
            const mockClient = new MockClient('test')

            mockClient.connect.mockImplementation(async () => MockClient)
            mockDb.collection.mockImplementation(() => mockDb)
            mockDb.findOne.mockImplementation(() => {
                return null
            })

            mocked(MongoHelper).getDatabase.mockImplementation(async () => {
                return mockDb
            })

            const UserRepository = getFakeUserRepository()
            const exists = await UserRepository.checkByEmail(faker.email)

            expect(exists).toBe(false)
        })
    })

    describe('updateAccessToken()', () => {
        test('Should update the user accessToken on success', async () => {
            const mockDb = new MockDb()
            const mockCollection = new MockCollection()
            const mockClient = new MockClient('test')

            mockClient.connect.mockImplementation(async () => MockClient)
            mockDb.collection.mockImplementation(() => mockCollection)
            mockCollection.updateOne.mockImplementation(() => {
                return { ops: ['test'] }
            })

            mocked(MongoHelper).getDatabase.mockImplementation(async () => {
                return mockDb
            })

            const UserRepository = getFakeUserRepository()

            const accessToken = faker.uuid
            const fakeUserId = '1'
            await UserRepository.updateAccessToken(fakeUserId, accessToken)

            expect(mockCollection.updateOne).toHaveBeenLastCalledWith(
                {
                    _id: fakeUserId,
                },
                {
                    $set: {
                        accessToken,
                    },
                },
            )
        })
    })

    describe('loadByToken()', () => {
        const { name, email, password, uuid } = faker

        test('Should return an user on loadByToken', async () => {
            const mockDb = new MockDb()
            const mockCollection = new MockCollection()
            const mockClient = new MockClient('test')

            const fakeUser = {
                id: 'id',
                name,
                email,
                password,
            }

            mockClient.connect.mockImplementation(async () => MockClient)
            mockDb.collection.mockImplementation(() => mockCollection)
            mockCollection.findOne.mockImplementation(() => fakeUser)

            mocked(MongoHelper).map.mockImplementation(async () => {
                return fakeUser
            })

            mocked(MongoHelper).getDatabase.mockImplementation(async () => {
                return mockDb
            })

            const UserRepository = getFakeUserRepository()

            const user = await UserRepository.loadByToken(uuid)

            expect(user).toBeTruthy()
            expect(user.id).toBeTruthy()
        })

        test('Should return null if loadByToken fails', async () => {
            const mockDb = new MockDb()
            const mockCollection = new MockCollection()
            const mockClient = new MockClient('test')

            mockClient.connect.mockImplementation(async () => MockClient)
            mockDb.collection.mockImplementation(() => mockCollection)
            mockCollection.findOne.mockImplementation(() => null)

            mocked(MongoHelper).getDatabase.mockImplementation(async () => {
                return mockDb
            })

            const UserRepository = getFakeUserRepository()

            const user = await UserRepository.loadByToken(uuid)
            expect(user).toBeFalsy()
        })
    })
})
