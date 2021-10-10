/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { RequestHandler } from 'express'

import Controller from '@/presentation/controllers/controller'
import { HttpStatus } from '@/presentation/helpers/http-helper'
import qs from 'qs'

type Adapter = (controller: Controller) => RequestHandler

export const adaptRoute: Adapter = controller => async (req, res) => {
  const request = {
    ...(req.body || {}),
    ...(req.params || {}),
    ...(req.query || {})
  }

  const { statusCode, data } = await controller.handle(qs.parse(request))
  const json = [HttpStatus.OK, HttpStatus.OK_RANGE_END].includes(statusCode) ? data : { error: data.message }
  res.status(statusCode).json(json)
}

export default adaptRoute
