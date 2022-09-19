import { HttpStatus } from '@nestjs/common';

export interface GenericErrorException {
  error: SerializedException;
}

export interface SerializedException {
  message: string;
  code: string;
  stack?: string;
  metadata?: unknown;
}

/**
 * Base class for custom exceptions.
 *
 * @abstract
 * @class ExceptionBase
 * @extends {Error}
 */
export abstract class ExceptionBase extends Error {
  /**
   * @param {string} message
   * @param {ObjectLiteral} [metadata={}]
   * **BE CAREFUL** not to include sensitive info in 'metadata'
   * to prevent leaks since all exception's data will end up
   * in application's log files. Only include non-sensitive
   * info that may help with debugging.
   */
  constructor(readonly message: string, readonly metadata?: unknown) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }

  abstract code: string;
  abstract httpStatus: HttpStatus;

  toJSON(): GenericErrorException {
    console.log('toJSON', this);
    const result = {
      error: {
        status: this.httpStatus,
        message: this.message || this.code,
        code: this.code,
        stack: this.stack,
        metadata: this.metadata,
      },
    };

    if (process.env.NODE_ENV == 'production') {
      delete result.error.stack;
    }

    return result;
  }
}
