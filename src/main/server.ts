import App from './config/app'
import loginRoutes from './routes/login-routes'

const port = 3000 || parseInt(process.env.PORT, 10)

const routes = [loginRoutes]

const app = new App(routes, port)
app.listen()
