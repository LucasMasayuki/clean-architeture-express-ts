import { UserInputError, AuthenticationError, ForbiddenError, ApolloError } from 'apollo-server-express'

import HttpStatus from '@/shared/enums/httpStatus'
import Controller from '@/presentation/controllers/controller'

const adaptResolver = async (controller: Controller, args?: any, context?: any): Promise<any> => {
  const request = {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    ...(args || {}),
    userId: context?.req?.userId
  }

  const httpResponse = await controller.handle(request)

  switch (httpResponse.statusCode) {
    case HttpStatus.OK:
    case HttpStatus.NO_CONTENT:
      return httpResponse.data
    case HttpStatus.BAD_REQUEST:
      throw new UserInputError(httpResponse.data.message)
    case HttpStatus.UNAUTHORIZED:
      throw new AuthenticationError(httpResponse.data.message)
    case HttpStatus.FORBIDDEN:
      throw new ForbiddenError(httpResponse.data.message)
    default:
      throw new ApolloError(httpResponse.data.message)
  }
}
export default adaptResolver
