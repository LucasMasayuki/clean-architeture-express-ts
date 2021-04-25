/* eslint-disable class-methods-use-this */
import MongoHelper from '@/infra/database/mongodb/mongodb'
import { LogErrorRepository } from '@/data/interfaces/database/log/log-error-repository'

export default class LogMongoRepository implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
        const database = await MongoHelper.getDatabase()
        await database.collection('errors').insertOne({
            stack,
            date: new Date(),
        })
    }
}
