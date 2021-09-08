/* eslint-disable class-methods-use-this */
import { AddUserRepository } from '@/data/interfaces/database/user/add-user-repository'

import { CheckUserByEmailRepository } from '@/data/interfaces/database/user/check-user-by-email-repository'

import { LoadUserByEmailRepository } from '@/data/interfaces/database/user/load-user-by-email-repository'
import { LoadUserByTokenRepository } from '@/data/interfaces/database/user/load-user-by-token-repository'

import { UpdateAccessTokenRepository } from '@/data/interfaces/database/user/update-access-token-repository'
import { UserModel } from '@/domain/models/user'
import { AddUserParams } from '@/domain/usecases/add-user'
import MongoHelper from '@/infra/database/mongodb/mongodb'

export default class UserMongoRepository
    implements
        LoadUserByEmailRepository,
        CheckUserByEmailRepository,
        AddUserRepository,
        UpdateAccessTokenRepository,
        LoadUserByTokenRepository
{
    async loadByEmail(email: string): Promise<UserModel> {
        const database = await MongoHelper.getDatabase()

        const user = await database.collection('user').findOne(
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

    async add(data: AddUserParams): Promise<boolean> {
        const database = await MongoHelper.getDatabase()
        const userCollection = database.collection('user')

        const result = await userCollection.insertOne(data)

        return result.ops[0] !== null
    }

    async updateAccessToken(id: string, token: string): Promise<void> {
        const database = await MongoHelper.getDatabase()
        const userCollection = await database.collection('user')
        await userCollection.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    accessToken: token,
                },
            },
        )
    }

    async checkByEmail(email: string): Promise<boolean> {
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

    async loadByToken(token: string): Promise<UserModel> {
        const database = await MongoHelper.getDatabase()
        const userCollection = database.collection('user')
        const user = await userCollection.findOne(
            {
                accessToken: token,
            },
            {
                projection: {
                    _id: 1,
                },
            },
        )

        return user && MongoHelper.map(user)
    }
}
