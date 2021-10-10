import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { GraphQLError } from 'graphql'

import HttpStatus from '@/shared/enums/httpStatus'
import typeDefs from '@/main/graphql/type-defs'
import resolvers from '@/main/graphql/resolvers'
import schemaDirectives from '@/main/graphql/directives'

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some((name) => name === errorName)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export default (app: express.Application): void => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    schemaDirectives,
    context: ({ req }) => ({ req }),
    plugins: [
      {
        requestDidStart: () => ({
          willSendResponse: ({ response, errors }) => handleErrors(response, errors ?? [])
        })
      }
    ]
  })
  server.applyMiddleware({ app })
}
