import MongoHelper from '@/infra/database/mongodb/mongodb'
import LogMongoRepository from '@/infra/database/mongodb/repositories/log-mongo-repository'

import faker from '@/tests/helpers/faker'
import { mocked } from 'ts-jest/utils'
import MockDate from 'mockdate'
import MockClient from './mocks/mock-client'
import MockDb from './mocks/mock-db'

const getFakeLogMongoRepository = (): LogMongoRepository => {
    return new LogMongoRepository()
}

jest.mock('@/infra/database/mongodb/mongodb')

describe('LogMongoRepository', () => {
    beforeAll(async () => {
        mocked(MongoHelper).getDatabase.mockClear()
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('Should create an error log on success', async () => {
        const now = new Date()
        MockDate.set(now)
        const fakeUser = {
            id: 'test',
            name: 'test',
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

        const dbSpy = jest.spyOn(mockDb, 'insertOne')

        const fakeLogMongoRepository = getFakeLogMongoRepository()
        await fakeLogMongoRepository.logError(faker.words)
        const stack = faker.words

        expect(dbSpy).toHaveBeenCalledWith({ stack, date: now })
    })
})
