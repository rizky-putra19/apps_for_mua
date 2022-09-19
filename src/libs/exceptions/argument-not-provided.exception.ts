import { HttpStatus } from '@nestjs/common';
import { ExceptionBase } from './exception.base';
import { ExceptionCodes } from './exception.codes';

/**
 * Used to indicate that an argument was not provided (is empty object/array, null of undefined).
 *
 * @class ArgumentNotProvidedException
 * @extends {ExceptionBase}
 */
export class ArgumentNotProvidedException extends ExceptionBase {
  readonly code = ExceptionCodes.argumentNotProvided;
  httpStatus: HttpStatus = HttpStatus.BAD_REQUEST;
}
