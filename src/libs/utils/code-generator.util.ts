import { randomInt } from 'crypto';

export interface GenerateOptions {
  digits?: boolean;
  lowerCaseAlphabets?: boolean;
  upperCaseAlphabets?: boolean;
  specialChars?: boolean;
}

export class CodeGenerator {
  private readonly options: GenerateOptions;
  private constructor(options?: GenerateOptions) {
    this.options =
      options != undefined
        ? {
            digits: options.digits != null ? options.digits : true,
            lowerCaseAlphabets:
              options.lowerCaseAlphabets != null
                ? options.lowerCaseAlphabets
                : true,
            specialChars:
              options.specialChars != null ? options.specialChars : true,
            upperCaseAlphabets:
              options.upperCaseAlphabets != null
                ? options.upperCaseAlphabets
                : true,
          }
        : {
            digits: true,
            lowerCaseAlphabets: true,
            specialChars: true,
            upperCaseAlphabets: true,
          };
  }
  static generate(length?: number, options?: GenerateOptions): string {
    if (length == null) {
      length = 10;
    }
    const codeGenerator = new CodeGenerator(options);
    const allowChars = codeGenerator.allowedChars();
    let password = '';
    while (password.length < length) {
      const charIdx = randomInt(0, allowChars.length);
      password += allowChars[charIdx];
    }
    return password;
  }

  allowedChars(): string {
    const generateOptions = this.options;

    const digits = '0123456789';
    const lowerCaseAlphabets = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseAlphabets = lowerCaseAlphabets.toUpperCase();
    const specialChars = '#!&@';

    const allowedChars =
      ((generateOptions.digits || '') && digits) +
      ((generateOptions.lowerCaseAlphabets || '') && lowerCaseAlphabets) +
      ((generateOptions.upperCaseAlphabets || '') && upperCaseAlphabets) +
      ((generateOptions.specialChars || '') && specialChars);
    return allowedChars;
  }
}
