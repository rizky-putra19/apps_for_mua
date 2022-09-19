import { HttpStatus } from '@nestjs/common';
import { ExceptionBase } from './exception.base';
import { ExceptionCodes } from './exception.codes';

/**
 * Used to indicate that an incorrect argument was provided to a method/function/class constructor
 *
 * @class ArgumentInvalidException
 * @extends {ExceptionBase}
 */
export class ArgumentInvalidException extends ExceptionBase {
  readonly code = ExceptionCodes.argumentInvalid;
  httpStatus: HttpStatus = HttpStatus.BAD_REQUEST;
}
