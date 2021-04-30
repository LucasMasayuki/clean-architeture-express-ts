import { Controller } from '@/presentation/interfaces/controller'
import HttpStatus from '@/shared/enums/httpStatus'

import { UserInputError, AuthenticationError, ForbiddenError, ApolloError } from 'apollo-server-express'

const adaptResolver = async (controller: Controller, args?: any, context?: any): Promise<any> => {
    const request = {
        ...(args || {}),
        userId: context?.req?.userId,
    }

    const httpResponse = await controller.handle(request)

    switch (httpResponse.statusCode) {
        case HttpStatus.OK:
        case HttpStatus.NO_CONTENT:
            return httpResponse.body
        case HttpStatus.BAD_REQUEST:
            throw new UserInputError(httpResponse.body.message)
        case HttpStatus.UNAUTHORIZED:
            throw new AuthenticationError(httpResponse.body.message)
        case HttpStatus.FORBIDDEN:
            throw new ForbiddenError(httpResponse.body.message)
        default:
            throw new ApolloError(httpResponse.body.message)
    }
}
export default adaptResolver
