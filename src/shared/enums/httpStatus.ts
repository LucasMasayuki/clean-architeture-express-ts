// eslint-disable-next-line no-shadow
enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    OK_RANGE_END = 299,
    NOT_MODIFIED = 304,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    GONE = 410,
    UNSUPPORTED_MEDIA_TYPE = 415,
    UNPROCESSABLE_ENTITY = 420,
    TOO_MANY_REQUESTS = 429,
    ERROR = 500,
}

export default HttpStatus
