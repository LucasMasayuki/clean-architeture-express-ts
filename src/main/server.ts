import App from './config/app'
import loginRoutes from './routes/login-routes'

const port = 3000 || process.env.PORT

const routes = [loginRoutes]

const app = new App(routes, port)
app.listen()
