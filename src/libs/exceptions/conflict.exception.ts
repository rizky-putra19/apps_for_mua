import { HttpStatus } from '@nestjs/common';
import { ExceptionBase } from './exception.base';
import { ExceptionCodes } from './exception.codes';

export class ConflictException extends ExceptionBase {
  readonly code = ExceptionCodes.conflict;

  httpStatus: HttpStatus = HttpStatus.CONFLICT;
}
