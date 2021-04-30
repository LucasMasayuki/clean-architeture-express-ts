import makeAuthMiddleware from '@/main/factories/middlewares/auth-middlewares-factory'

import { SchemaDirectiveVisitor, ForbiddenError } from 'apollo-server-express'
import { GraphQLField, defaultFieldResolver } from 'graphql'

export default class AuthDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: GraphQLField<any, any>): any {
        const { resolve = defaultFieldResolver } = field

        // eslint-disable-next-line no-param-reassign
        field.resolve = async (parent, args, context, info) => {
            const request = {
                accessToken: context?.req?.headers?.['x-access-token'],
            }

            const httpResponse = await makeAuthMiddleware().handle(request)
            if (httpResponse.statusCode === 200) {
                Object.assign(context?.req, httpResponse.body)
                return resolve.call(this, parent, args, context, info)
            }

            throw new ForbiddenError(httpResponse.body.message)
        }
    }
}
