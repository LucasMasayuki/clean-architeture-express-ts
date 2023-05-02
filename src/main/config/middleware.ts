import { Express, json, urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import contentType from '../middlewares/content-type'
import logger from 'morgan'
import compression from 'compression'

export const setupMiddlewares = (app: Express): void => {
  app.use(cors())

  app.use(contentType)
  app.use(logger('dev'))
  app.use(helmet())
  app.use(json())
  app.use(urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(compression())
}
