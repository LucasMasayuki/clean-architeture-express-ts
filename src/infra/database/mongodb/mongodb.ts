/* eslint-disable @typescript-eslint/no-explicit-any */
import env from '@/main/config/env'
import { MongoClient, Db } from 'mongodb'

class MongoDb {
    private static instance: MongoDb

    private uri: string

    private client!: MongoClient

    constructor() {
        this.uri = `mongodb://localhost:${env.port}/host`

        if (env.nodeEnv === 'production') {
            this.uri = `mongodb+srv://${env.mongoUser}:${env.mongoPassword}@host.acqxz.mongodb.net/${env.mongDb}?retryWrites=true&w=majority`
        }
    }

    public async connect(): Promise<void> {
        this.client = await MongoClient.connect(this.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    }

    public async disconnect(): Promise<void> {
        await this.client?.close()
    }

    async getDatabase(): Promise<Db> {
        if (!this.client?.isConnected()) {
            await this.connect()
        }

        return this.client.db()
    }

    // eslint-disable-next-line class-methods-use-this
    public map(data: any): any {
        const { _id, ...rest } = data
        return { ...rest, id: _id }
    }

    public mapCollection(collection: any[]): any[] {
        return collection.map((c) => this.map(c))
    }

    public static getInstance(): MongoDb {
        if (!MongoDb.instance) {
            MongoDb.instance = new MongoDb()
        }

        return MongoDb.instance
    }
}

export default MongoDb.getInstance()
