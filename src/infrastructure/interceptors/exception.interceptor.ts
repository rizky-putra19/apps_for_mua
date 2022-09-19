import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  // To avoid confusion between internal exceptions and NestJS exceptions
  ConflictException as NestConflictException,
  NotFoundException as NestNotFoundException,
  BadRequestException as NestBadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ExceptionBase,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@libs/exceptions';

export class ExceptionInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ExceptionBase> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof ExceptionBase) {
          throw new HttpException(err, err.httpStatus);
        } else {
          return throwError(err);
        }
      }),
    );
  }
}
