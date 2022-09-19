import { HttpStatus } from '@nestjs/common';
import { ExceptionBase } from '@src/libs/exceptions';

export class ServiceAlreadyExist extends ExceptionBase {
  static readonly message: 'service already exists';
  public readonly code = 'SERVICE_ALREADY_EXIST';
  httpStatus: HttpStatus = HttpStatus.CONFLICT;

  constructor(message?: string, metadata?: unknown) {
    super(message || ServiceAlreadyExist.message, metadata);
  }
}
