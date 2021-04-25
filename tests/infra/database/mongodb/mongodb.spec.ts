import { MongoClient } from 'mongodb'

import { mocked } from 'ts-jest/utils'
import mongodb from '@/infra/database/mongodb/mongodb'
import MockClient from './mocks/mock-client'

jest.mock('mongodb')
const mockClient = new MockClient('test')

describe('MongoDb', () => {
    beforeAll(async () => {
        mocked(MongoClient).connect.mockClear()
        mockClient.close.mockClear()
        mockClient.isConnected.mockClear()
    })

    test('Should connect to mongo database', async () => {
        mocked(MongoClient).connect.mockImplementation(async () => mockClient)

        const connectSpy = jest.spyOn(mongodb, 'connect')

        await mongodb.connect()
        expect(connectSpy).toHaveBeenCalledTimes(1)
    })

    test('Should disconnet mongo database', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        mockClient.close.mockImplementation(async () => {})
        mocked(MongoClient).connect.mockImplementation(async () => mockClient)

        const connectSpy = jest.spyOn(mongodb, 'connect')

        await mongodb.connect()
        expect(connectSpy).toHaveBeenCalledTimes(1)

        const disconnectSpy = jest.spyOn(mockClient, 'close')

        await mongodb.disconnect()

        expect(disconnectSpy).toHaveBeenCalledTimes(1)
    })

    test('Should connect mongo database to get database, when client is not connected', async () => {
        mockClient.isConnected.mockImplementation(() => false)
        mocked(MongoClient).connect.mockImplementation(async () => mockClient)

        const connectSpy = jest.spyOn(mongodb, 'connect')
        const dbSpy = jest.spyOn(mockClient, 'db')

        await mongodb.getDatabase()

        expect(connectSpy).toHaveBeenCalledTimes(1)
        expect(dbSpy).toHaveBeenCalledTimes(1)
    })

    test('Should only return database, when client is connected', async () => {
        mockClient.isConnected.mockImplementation(() => true)
        mocked(MongoClient).connect.mockImplementation(async () => mockClient)

        const dbSpy = jest.spyOn(mockClient, 'db')

        await mongodb.getDatabase()

        expect(dbSpy).toHaveBeenCalledTimes(1)
    })

    test('Should map to id, ...rest', async () => {
        const data = { _id: 1, users_id: 2 }
        const map = mongodb.map(data)

        expect(map.id).toBeTruthy()
    })

    test('Should map collection to id, ...rest', async () => {
        const data = [{ _id: 1, users_id: 2 }]
        const map = mongodb.mapCollection(data)

        expect(map[0].id).toBeTruthy()
    })
})
