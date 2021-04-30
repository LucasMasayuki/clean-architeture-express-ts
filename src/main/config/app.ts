import express, { Router } from 'express'

import cookieParser from 'cookie-parser'
import logger from 'morgan'

import MongoDb from '@/infra/database/mongodb/mongodb'
import cors from '../middlewares/cors'
import contentType from '../middlewares/content-type'
import bodyParser from '../middlewares/body-parser'
import initApolloServer from './apollo-server'

class App {
    private app: express.Application

    public port: number

    constructor(routes: Router[], port: number) {
        this.app = express()
        this.port = port

        this.initializeMiddlewares()
        this.initializeRoutes(routes)
        initApolloServer(this.app)
    }

    private initializeMiddlewares() {
        this.app.use(cors)
        this.app.use(contentType)
        this.app.use(logger('dev'))
        this.app.use(bodyParser)
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(cookieParser())
    }

    private initializeRoutes(routes: Router[]) {
        routes.forEach((route: Router) => {
            this.app.use(route)
        })
    }

    public getServer(): express.Application {
        return this.app
    }

    public listen(): void {
        MongoDb.connect()
            .then(() => {
                this.app.listen(this.port)
            })
            .catch(console.error)
    }
}

export default App
