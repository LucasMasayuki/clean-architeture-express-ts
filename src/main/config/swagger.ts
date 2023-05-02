import { Express } from 'express'
import SwaggerJSDoc from 'swagger-jsdoc'
import SwaggerUi from 'swagger-ui-express'

export const setupSwagger = (app: Express): void => {
  const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Api do petzillas v2',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:8000'
      }
    ]
  }

  const options = {
    definition: swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: [
      'src/presentation/controllers/**/*.ts',
      'src/infra/database/entities/*.ts'
    ]
  }

  const swaggerSpec = SwaggerJSDoc(options)
  app.use('/api-docs', (req, res, next) => {
    if (req.url.endsWith('.js')) {
      res.set('Content-Type', 'text/javascript')
    } else if (req.url.endsWith('.css')) {
      res.set('Content-Type', 'text/css')
    } else {
      res.set('Content-Type', 'text/html')
    }

    next()
  })

  // Serve the Swagger UI static files from the dist directory
  app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(swaggerSpec, { explorer: true }))
}
