import request from 'supertest'

import App from '@/main/config/app'

describe('Content Type Middleware', () => {
  test('Should return default content type as json', async () => {
    const app = new App([], 3000)

    app.getServer().get('/test_content_type', (req, res) => {
      res.send('')
    })
    await request(app.getServer())
      .get('/test_content_type')
      .expect('content-type', /json/)
  })

  test('Should return xml content type when forced', async () => {
    const app = new App([], 3000)

    app.getServer().get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app.getServer())
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
