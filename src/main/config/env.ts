export default {
    jwtSecret: process.env.JWT_SECRET,
    mongoUser: process.env.MONGO_USER,
    mongoPassword: process.env.MONGO_PASSWORD,
    mongDb: process.env.MONGO_DB,
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    jwtExpirationIn: process.env.JWT_EXPIRATION_IN,
}
