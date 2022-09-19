import { HttpStatus } from '@nestjs/common';
import { ExceptionBase } from '@src/libs/exceptions';

export class InvalidOtpError extends ExceptionBase {
  public readonly code = 'OTP.INVALID_OTP';

  httpStatus: HttpStatus = HttpStatus.BAD_REQUEST;

  constructor(message: string, metadata?: unknown) {
    super(message, metadata);
  }
}
