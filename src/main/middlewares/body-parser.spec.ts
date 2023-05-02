import request from 'supertest'
import { initializeApp } from '../config/app'

describe('Body Parser Middleware', () => {
  test('Should parse body as json', async () => {
    const app = await initializeApp()

    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Test' })
      .expect({ name: 'Test' })
  })
})
