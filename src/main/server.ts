import logger from '@/infra/gateways/winston-logger'
import env from './config/env'
import DbConnection from '@/infra/database/helpers/db-connection'
import { initializeApp } from './config/app'

DbConnection.getInstance()
  .connect()
  .then(async () => {
    const app = await initializeApp()
    app.listen(env.port, () => logger.info(`Server running at http://localhost:${env.port}`))
  })
  .catch(console.error)
