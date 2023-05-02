import { ApolloServer } from 'apollo-server-express'
import { GraphQLError } from 'graphql'

import typeDefs from '@/main/graphql/type-defs'
import resolvers from '@/main/graphql/resolvers'
import { HttpStatus } from '@/presentation/helpers/http-helper'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { authDirectiveTransformer } from '../graphql/directives/auth-directive'

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some((name) => name === errorName)
}

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach((error) => {
    response.data = undefined
    if (checkError(error, 'UserInputError')) {
      response.http.status = HttpStatus.BAD_REQUEST
    } else if (checkError(error, 'AuthenticationError')) {
      response.http.status = HttpStatus.UNAUTHORIZED
    } else if (checkError(error, 'ForbiddenError')) {
      response.http.status = HttpStatus.FORBIDDEN
    } else {
      response.http.status = HttpStatus.ERROR
    }
  })
}

let schema = makeExecutableSchema({ resolvers, typeDefs })
schema = authDirectiveTransformer(schema)

export const setupApolloServer = (): ApolloServer => new ApolloServer({
  schema,
  context: ({ req }) => ({ req }),
  plugins: [{
    requestDidStart: async () => ({
      willSendResponse: async ({ response, errors }) => handleErrors(response, errors ?? [])
    })
  }]
})
