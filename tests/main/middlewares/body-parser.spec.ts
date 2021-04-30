import request from 'supertest'
import App from '@/main/config/app'

describe('Body Parser Middleware', () => {
    test('Should parse body as json', async () => {
        const app = new App([], 3000)

        app.getServer().post('/test_body_parser', (req, res) => {
            res.send(req.body)
        })

        await request(app.getServer()).post('/test_body_parser').send({ name: 'Test' }).expect({ name: 'Test' })
    })
})
