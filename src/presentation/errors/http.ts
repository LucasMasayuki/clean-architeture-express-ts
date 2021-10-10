/* eslint-disable max-classes-per-file */
export class ServerError extends Error {
  constructor (error?: Error) {
    super('Server failed. Try again soon')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}

export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor (error?: Error) {
    super('Access denied')
    this.name = 'ForbiddenError'
    this.stack = error?.stack
  }
}

export class UnprocessableEntityError extends Error {
  constructor (error?: Error) {
    super('Unprocessable entity error')
    this.name = 'UnprocessableEntityError'
    this.stack = error?.stack
  }
}
