
import { ServerError } from '@/presentation/errors'
import { HttpStatus } from '@/presentation/helpers/http-helper'
import { RequestHandler } from 'express'
import multer from 'multer'

type Adapter = (name: string) => RequestHandler

export const adaptSingleMulter: Adapter = name => (req, res, next) => {
  const upload = multer().single(name)
  upload(req, res, (error: any) => {
    if (error !== undefined) {
      return res.status(HttpStatus.ERROR).json({ error: new ServerError(error).message })
    }

    if (req.file !== undefined) {
      req.locals = { ...req.locals, file: { buffer: req.file.buffer, mimeType: req.file.mimetype, path: req.file.path } }
    }

    next()
  })
}
