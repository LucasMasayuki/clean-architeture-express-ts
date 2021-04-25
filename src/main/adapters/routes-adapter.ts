import { Controller } from '@/presentation/interfaces/controller'
import HttpStatus from '@/shared/enums/httpStatus'

import { Request, Response } from 'express'

const adaptRoute = (controller: Controller) => {
    return async (req: Request, res: Response): Promise<void> => {
        const request = {
            ...(req.body || {}),
            ...(req.params || {}),
        }

        const httpResponse = await controller.handle(request)
        const isSuccess = httpResponse.statusCode >= HttpStatus.OK && httpResponse.statusCode <= HttpStatus.OK_RANGE_END

        if (isSuccess) {
            res.status(httpResponse.statusCode).json(httpResponse.body)
        } else {
            res.status(httpResponse.statusCode).json({
                error: httpResponse.body.message,
            })
        }
    }
}

export default adaptRoute
