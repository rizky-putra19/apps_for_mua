import { HttpStatus } from '@nestjs/common';
import { ExceptionBase } from './exception.base';
import { ExceptionCodes } from './exception.codes';

export class NotFoundException extends ExceptionBase {
  constructor(message = 'Not found') {
    super(message);
  }

  code = ExceptionCodes.notFound;
  httpStatus: HttpStatus = HttpStatus.NOT_FOUND;
}
