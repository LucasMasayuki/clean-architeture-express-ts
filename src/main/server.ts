import App from './config/app'
import loginRoutes from './routes/login-routes'

const port = process.env.PORT || '3000'

const routes = [loginRoutes]

const app = new App(routes, parseInt(port, 10))
app.listen()
