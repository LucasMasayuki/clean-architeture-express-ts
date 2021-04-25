import express, { Router } from 'express'

import cookieParser from 'cookie-parser'
import logger from 'morgan'

import cors from 'cors'
import MongoDb from '@/infra/database/mongodb/mongodb'

class App {
    private app: express.Application

    public port: number

    constructor(routes: Router[], port: number) {
        this.app = express()
        this.port = port

        MongoDb.connect()

        this.initializeMiddlewares()
        this.initializeRoutes(routes)
    }

    private initializeMiddlewares() {
        this.app.use(cors())
        this.app.use(logger('dev'))
        this.app.use(express.json())
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
        this.app.listen(this.port)
    }
}

export default App
