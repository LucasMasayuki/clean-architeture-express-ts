import * as dotenv from 'dotenv'

dotenv.config()

export default {
  jwtSecret: process.env.JWT_SECRET ?? '',
  port: parseInt(process.env.APP_PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV,
  jwtExpirationIn: parseInt(process.env.JWT_EXPIRATION_IN ?? '5000', 10),
  jwtRefreshTokenExpirationIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_IN ?? '86400', 10)
}
