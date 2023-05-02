import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export const setupRoutes = async (app: Express): Promise<void> => {
  const router = Router()
  const promises = readdirSync(join(__dirname, '../routes'))
    .filter(file => !file.endsWith('.map'))
    .map(async file => {
      (await import(`../routes/${file}`)).default(router)
    })

  await Promise.all(promises)

  app.use('/api/v2', router)
}
