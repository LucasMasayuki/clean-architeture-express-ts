
import { IocContainer } from '@/main/ioc-containers/inversify.config'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { ForbiddenError } from 'apollo-server-express'
import { GraphQLSchema } from 'graphql'

export const authDirectiveTransformer = (schema: GraphQLSchema): GraphQLSchema => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')
      if (authDirective != null) {
        const { resolve } = fieldConfig
        fieldConfig.resolve = async (parent, args, context, info) => {
          const request = {
            token: context?.req?.headers?.['x-access-token']
          }
          const httpResponse = await IocContainer.resolve(AuthMiddleware).handle(request)
          if (httpResponse.statusCode === 200) {
            Object.assign(context?.req, httpResponse.data)
            return resolve?.call(this, parent, args, context, info)
          } else {
            throw new ForbiddenError(httpResponse.data.message)
          }
        }
      }
      return fieldConfig
    }
  })
}
