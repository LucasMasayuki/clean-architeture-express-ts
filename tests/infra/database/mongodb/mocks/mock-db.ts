import { Db, Server } from 'mongodb'

export default class MockDb extends Db {
    constructor(databaseName = 'test', serverConfig = new Server('test', 0)) {
        super(databaseName, serverConfig)
    }

    public collection = jest.fn()

    public findOne = jest.fn()

    public updateOne = jest.fn()

    public insertOne = jest.fn()
}
