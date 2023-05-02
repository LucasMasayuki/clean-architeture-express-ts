
import { ServerError } from '@/presentation/errors'
import { HttpStatus } from '@/presentation/helpers/http-helper'
import { RequestHandler } from 'express'
import multer from 'multer'

type Adapter = (name: string) => RequestHandler

export const adaptMultipleMulter: Adapter = name => (req, res, next) => {
  const upload = multer({ dest: 'uploads/' }).array(name, 12)

  upload(req, res, (error: any) => {
    if (error !== undefined) {
      return res.status(HttpStatus.ERROR).json({ error: new ServerError(error).message })
    }

    if (req.files !== undefined) {
      req.files = req.files as any[]
      req.locals = { ...req.locals, files: req.files.map((file: any) => { return { buffer: file.buffer, mimeType: file.mimetype, path: file.path } }) }
    }

    next()
  })
}
