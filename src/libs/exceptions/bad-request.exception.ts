import { HttpStatus } from '@nestjs/common';
import { ExceptionBase } from './exception.base';
import { ExceptionCodes } from './exception.codes';

export class BadRequestException extends ExceptionBase {
  constructor(message = 'Bad Request') {
    super(message);
  }

  readonly code = ExceptionCodes.badRequest;
  httpStatus: HttpStatus = HttpStatus.BAD_REQUEST;
}
