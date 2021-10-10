import App from './config/app'
import env from './config/env'
import { routes } from './routes'

const app = new App(routes, env.port)
app.listen()
