export class BadRequestError extends Error {
  status: number = 400;
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  status: number = 401;
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends Error {
  status: number = 403;
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error {
  status: number = 404;
  constructor(message: string) {
    super(message);
  }
}
