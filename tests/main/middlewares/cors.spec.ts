import request from 'supertest'

import App from '@/main/config/app'

describe('CORS Middleware', () => {
  test('Should enable CORS', async () => {
    const app = new App([], 3000)

    app.getServer().get('/test_cors', (req, res) => {
      res.send()
    })

    await request(app.getServer())
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
