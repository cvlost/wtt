export abstract class ServerError {
  protected constructor(readonly statusCode: number, readonly error: string) {}
}

export class BadRequest extends ServerError {
  constructor(error = 'Bad Request') {
    super(400, error);
  }
}

export class NotFound extends ServerError {
  constructor(error = 'Not Found') {
    super(404, error);
  }
}

export class Unauthorized extends ServerError {
  constructor(error = 'Unauthorized') {
    super(401, error);
  }
}
