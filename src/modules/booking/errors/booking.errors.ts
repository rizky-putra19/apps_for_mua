import { HttpStatus } from '@nestjs/common';
import { ExceptionBase, ExceptionCodes } from '@src/libs/exceptions';

export class BookingNotFound extends ExceptionBase {
  static readonly message: 'Booking not found';
  code = ExceptionCodes.notFound;
  httpStatus: HttpStatus = HttpStatus.NOT_FOUND;
  constructor(message?: string, metadata?: unknown) {
    super(message || BookingNotFound.message, metadata);
  }
}
