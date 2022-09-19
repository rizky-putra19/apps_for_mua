import { HttpStatus } from '@nestjs/common';
import {
  ExceptionBase,
  ExceptionCodes,
  NotFoundException,
} from '@src/libs/exceptions';

export class CategoryAlreadyExistsError extends ExceptionBase {
  static readonly message: 'category already exists';

  public readonly code = 'USER.ALREADY_EXISTS';

  httpStatus: HttpStatus = HttpStatus.CONFLICT;

  constructor(metadata?: unknown) {
    super(CategoryAlreadyExistsError.message, metadata);
  }
}

export class CategoryNotFoundError extends NotFoundException {
  static readonly message = 'category not found';
  static readonly code = ExceptionCodes.categoryNotFound;
  static readonly httpStatus = HttpStatus.NOT_FOUND;

  constructor() {
    super(CategoryNotFoundError.message);
  }
}
