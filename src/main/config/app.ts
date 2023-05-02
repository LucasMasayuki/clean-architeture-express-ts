import { setupRoutes } from '@/main/config/routes'
import express, { Express } from 'express'
import env from './env'
// import { setupCrons } from './cron'
import { setupMiddlewares } from './middleware'
import { setupSwagger } from './swagger'
// import initApolloServer from './apollo-server'

export const initializeApp = async (): Promise<Express> => {
  const app = express()

  setupMiddlewares(app)
  // setupCrons(app)
  await setupRoutes(app)
  // initApolloServer(app) remove graphql temporary

  if (env.nodeEnv !== 'production') {
    setupSwagger(app)
  }

  return app
}
