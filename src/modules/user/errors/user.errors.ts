import { HttpStatus } from '@nestjs/common';
import {
  ExceptionBase,
  ExceptionCodes,
  NotFoundException,
} from '@src/libs/exceptions';

export class UserAlreadyExistsError extends ExceptionBase {
  static readonly message: 'User already exists';

  public readonly code = 'USER.ALREADY_EXISTS';

  httpStatus: HttpStatus = HttpStatus.CONFLICT;

  constructor(message?: string, metadata?: unknown) {
    super(message || UserAlreadyExistsError.message, metadata);
  }
}

export class UserNotFoundError extends ExceptionBase {
  static readonly message: 'User not found';

  code = ExceptionCodes.userNotFound;
  httpStatus: HttpStatus = HttpStatus.NOT_FOUND;

  constructor(message?: string, metadata?: unknown) {
    super(message || UserAlreadyExistsError.message, metadata);
  }
}

export class InvalidPasswordError extends ExceptionBase {
  public static readonly message: 'Invalid credentials';

  public readonly code = 'USER.INVALID_PASSWORD';
  httpStatus: HttpStatus = HttpStatus.BAD_REQUEST;

  constructor(message?: string, metadata?: unknown) {
    super(message ? message : InvalidPasswordError.message, metadata);
  }
}

export class UserNotVerified extends ExceptionBase {
  public static readonly message: 'User not verified';

  public readonly code = 'USER.NOT.VERIFIED';
  httpStatus: HttpStatus = HttpStatus.UNAUTHORIZED;

  constructor(message?: string, metadata?: unknown) {
    super(message ? message : UserNotFoundError.message, metadata);
  }
}
