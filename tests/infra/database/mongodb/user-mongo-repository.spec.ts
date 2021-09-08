import UserMongoRepository from '@/infra/database/mongodb/repositories/user-mongo-repository'
import MongoHelper from '@/infra/database/mongodb/mongodb'

import MockDb from '@/tests/infra/database/mongodb/mocks/mock-db'
import MockClient from '@/tests/infra/database/mongodb/mocks/mock-client'
import mockAddUserParams from '@/tests/domain/mocks/mock-add-user-params'
import faker from 'faker'
import MockCollection from './mocks/mock-collection'

jest.mock('@/infra/database/mongodb/mongodb')

const mockedMongoHelper = MongoHelper as jest.Mocked<typeof MongoHelper>

const getFakeUserRepository = (): UserMongoRepository => {
    return new UserMongoRepository()
}

describe('UserMongoRepository', () => {
    afterEach(() => {
        jest.clearAllMocks()
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

            mockedMongoHelper.getDatabase.mockImplementation(async () => {
                return mockDb
            })

            mockedMongoHelper.map.mockImplementation(async () => {
                return fakeUser
            })

            const UserRepository = getFakeUserRepository()
            const user = await UserRepository.loadByEmail(faker.internet.email())

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

            mockedMongoHelper.getDatabase.mockImplementation(async () => {
                return mockDb
            })

            mockedMongoHelper.map.mockImplementation(async () => {
                return null
            })

            const UserRepository = getFakeUserRepository()
            const user = await UserRepository.loadByEmail(faker.internet.email())

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

            mockedMongoHelper.getDatabase.mockImplementation(async () => {
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

            mockedMongoHelper.getDatabase.mockImplementation(async () => {
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

            mockedMongoHelper.getDatabase.mockImplementation(async () => {
                return mockDb
            })

            const UserRepository = getFakeUserRepository()
            const exists = await UserRepository.checkByEmail(faker.internet.email())

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

            mockedMongoHelper.getDatabase.mockImplementation(async () => {
                return mockDb
            })

            const UserRepository = getFakeUserRepository()

            const accessToken = faker.datatype.uuid()
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
        test('Should return an user on loadByToken', async () => {
            const mockDb = new MockDb()
            const mockCollection = new MockCollection()
            const mockClient = new MockClient('test')

            const fakeUser = {
                id: 'id',
                name: faker.name.firstName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            }

            mockClient.connect.mockImplementation(async () => MockClient)
            mockDb.collection.mockImplementation(() => mockCollection)
            mockCollection.findOne.mockImplementation(() => fakeUser)

            mockedMongoHelper.map.mockImplementation(async () => {
                return fakeUser
            })

            mockedMongoHelper.getDatabase.mockImplementation(async () => {
                return mockDb
            })

            const UserRepository = getFakeUserRepository()

            const user = await UserRepository.loadByToken(faker.datatype.uuid())

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

            mockedMongoHelper.getDatabase.mockImplementation(async () => {
                return mockDb
            })

            const UserRepository = getFakeUserRepository()

            const user = await UserRepository.loadByToken(faker.datatype.uuid())
            expect(user).toBeFalsy()
        })
    })
})
