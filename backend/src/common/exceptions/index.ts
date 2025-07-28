import { HttpException } from './http.exception';

export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

export class ConflictException extends HttpException {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}
