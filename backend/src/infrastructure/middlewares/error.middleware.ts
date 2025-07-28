import {
  ExpressErrorMiddlewareInterface,
  Middleware,
  HttpError,
} from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from '../../common/dto/reponse.dto';
import { HttpException } from '../../common/exceptions/http.exception';

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(err: any, req: Request, res: Response, next: NextFunction) {
    const defaultStatus = 500;
    const defaultMessage = 'Internal server error';

    let status = defaultStatus;
    let message: string | string[] = defaultMessage;

    // Routing-controllers bawaan
    if (err instanceof HttpError) {
      status = err.httpCode;
      message = err.message || defaultMessage;
    }
    // Class-validator
    else if (Array.isArray(err?.errors)) {
      status = 400;
      message = err.errors.map((e: any) => Object.values(e.constraints)).flat();
    }
    // Custom HttpException
    else if (err instanceof HttpException) {
      status = err.status;
      message = err.message;
    }
    // statusCode manual
    else if (err?.statusCode) {
      status = err.statusCode;
      message = err.message || defaultMessage;
    }
    // Unhandled error
    else {
      console.error('Unhandled error:', err);
    }

    const errorResponse = new HttpResponse(false, message);
    res.status(status).json(errorResponse);
  }
}
