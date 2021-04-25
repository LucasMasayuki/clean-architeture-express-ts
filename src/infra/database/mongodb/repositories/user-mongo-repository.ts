/* eslint-disable class-methods-use-this */
import {
    AddUserRepository,
    AddUserRepositoryParams,
    AddUserRepositoryResult,
} from '@/data/interfaces/database/user/add-user-repository'
import {
    CheckUserByEmailRepository,
    CheckUserByEmailRepositoryResult,
} from '@/data/interfaces/database/user/check-user-by-email-repository'
import {
    LoadUserByEmailRepository,
    LoadUserByEmailRepositoryResult,
} from '@/data/interfaces/database/user/load-user-by-email-repository'
import MongoHelper from '@/infra/database/mongodb/mongodb'

export default class UserMongoRepository
    implements LoadUserByEmailRepository, CheckUserByEmailRepository, AddUserRepository {
    async loadByEmail(email: string): Promise<LoadUserByEmailRepositoryResult> {
        const database = await MongoHelper.getDatabase()

        const user = await database.collection('accounts').findOne(
            {
                email,
            },
            {
                projection: {
                    _id: 1,
                    name: 1,
                    password: 1,
                },
            },
        )

        return user && MongoHelper.map(user)
    }

    async add(data: AddUserRepositoryParams): Promise<AddUserRepositoryResult> {
        const database = await MongoHelper.getDatabase()
        const userCollection = database.collection('user')

        const result = await userCollection.insertOne(data)

        return result.ops[0] !== null
    }

    async checkByEmail(email: string): Promise<CheckUserByEmailRepositoryResult> {
        const database = await MongoHelper.getDatabase()
        const userCollection = database.collection('user')

        const user = await userCollection.findOne(
            {
                email,
            },
            {
                projection: {
                    _id: 1,
                },
            },
        )

        return user !== null
    }
}
