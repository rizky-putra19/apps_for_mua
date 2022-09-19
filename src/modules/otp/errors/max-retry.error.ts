import { HttpStatus } from '@nestjs/common';
import { ExceptionBase } from '@src/libs/exceptions';

export class MaxRetryError extends ExceptionBase {
  static readonly message: 'Otp Request limit exceeded';

  public readonly code = 'OTP.MAX_RETRY_EXCEEDED';

  httpStatus: HttpStatus = HttpStatus.BAD_REQUEST;

  constructor(message: string, metadata?: unknown) {
    super(message, metadata);
  }
}
