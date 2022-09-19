import { HttpStatus } from '@nestjs/common';
import { ExceptionBase } from './exception.base';
import { ExceptionCodes } from './exception.codes';

/**
 * Used to indicate that an argument is out of allowed range
 * (for example: incorrect string/array length, number not in allowed min/max range etc)
 *
 * @class ArgumentOutOfRangeException
 * @extends {ExceptionBase}
 */
export class ArgumentOutOfRangeException extends ExceptionBase {
  readonly code = ExceptionCodes.argumentOutOfRange;

  httpStatus: HttpStatus = HttpStatus.BAD_REQUEST;
}
