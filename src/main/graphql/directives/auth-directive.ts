import { GraphQLField, defaultFieldResolver } from 'graphql'
import { SchemaDirectiveVisitor, ForbiddenError } from 'apollo-server-express'

import makeAuthMiddleware from '@/main/factories/middlewares/auth-middlewares-factory'
import { HttpStatus } from '@/presentation/helpers/http-helper'

export default class AuthDirective extends SchemaDirectiveVisitor {
  override visitFieldDefinition (field: GraphQLField<any, any>): any {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (parent, args, context, info) => {
      const authHeader = context?.req?.headers?.authorization
      const bearerToken = authHeader?.split(' ')[1]
      const request = {
        accessToken: bearerToken
      }

      const httpResponse = await makeAuthMiddleware().handle(request)
      if (httpResponse.statusCode === HttpStatus.OK) {
        Object.assign(context?.req, httpResponse.data)
        return resolve.call(this, parent, args, context, info)
      }

      throw new ForbiddenError(httpResponse.data.message)
    }
  }
}
