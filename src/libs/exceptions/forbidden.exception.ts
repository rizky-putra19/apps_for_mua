import { HttpStatus } from '@nestjs/common';
import { ExceptionBase } from './exception.base';
import { ExceptionCodes } from './exception.codes';

export class ForbiddenException extends ExceptionBase {
  constructor(message = 'Forbidden Access') {
    super(message);
  }

  readonly code = ExceptionCodes.forbidden;
  httpStatus: HttpStatus = HttpStatus.FORBIDDEN;
}
