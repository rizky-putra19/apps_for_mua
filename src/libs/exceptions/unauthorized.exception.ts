import { HttpStatus } from '@nestjs/common';
import { ExceptionBase } from './exception.base';
import { ExceptionCodes } from './exception.codes';

export class UnauthorizedException extends ExceptionBase {
  constructor(message = 'Unauthorized Access') {
    super(message);
  }

  readonly code = ExceptionCodes.unauthorized;
  httpStatus: HttpStatus = HttpStatus.UNAUTHORIZED;
}
