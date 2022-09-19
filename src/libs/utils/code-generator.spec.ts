import { CodeGenerator } from '@src/libs/utils/code-generator.util';

describe('OTP Generator Tests', function () {
  it('it should return 10 digit when length of password and options is not specified', function (done) {
    const otp = CodeGenerator.generate();
    console.log(otp);
    expect(otp).toHaveLength(10);
    done();
  });

  it('it should return 9 digit when length of password = 9 and options is not specified', function (done) {
    const otp = CodeGenerator.generate(9);
    console.log(otp);
    expect(otp).toHaveLength(9);
    done();
  });

  it('it should return 10 digit when options is { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false }', function (done) {
    const otp = CodeGenerator.generate(null, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log(otp);
    expect(otp).toHaveLength(10);
    expect(otp).toMatch(/^[0-9]+$/);
    expect(otp).not.toMatch(/^[a-zA-Z]+$/);
    expect(otp).not.toMatch(/^[#!&@]+$/);
    done();
  });

  it('it should return 10 alphabets when options is { digits: false, upperCaseAlphabets: false, specialChars: false }', function (done) {
    const otp = CodeGenerator.generate(null, {
      digits: false,
      lowerCaseAlphabets: true,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log(otp);
    expect(otp).toHaveLength(10);
    expect(otp).not.toMatch(/^[0-9]+$/);
    expect(otp).toMatch(/^[a-z]+$/);
    expect(otp).not.toMatch(/^[A-Z]+$/);
    expect(otp).not.toMatch(/^[#!&@]+$/);

    done();
  });

  it('it should return 10 uppercase alphabets when options is { digits: false, lowerCaseAlphabets: false, specialChars: false }', function (done) {
    const otp = CodeGenerator.generate(null, {
      digits: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: true,
      specialChars: false,
    });
    console.log(otp);

    expect(otp).toHaveLength(10);
    expect(otp).not.toMatch(/^[0-9]+$/);
    expect(otp).not.toMatch(/^[a-z]+$/);
    expect(otp).toMatch(/^[A-Z]+$/);
    expect(otp).not.toMatch(/^[#!&@]+$/);

    done();
  });

  it('it should return 10 specialChars when options is { digits: false, lowerCaseAlphabets: false, upperCaseAlphabets: false }', function (done) {
    const otp = CodeGenerator.generate(null, {
      digits: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: true,
    });
    console.log(otp);

    expect(otp).toHaveLength(10);
    expect(otp).not.toMatch(/^[0-9]+$/);
    expect(otp).not.toMatch(/^[a-z]+$/);
    expect(otp).not.toMatch(/^[A-Z]+$/);
    expect(otp).toMatch(/^[#!&@]+$/);

    done();
  });

  it('it should return 10 digits and alphabets when options is {  upperCaseAlphabets: false, specialChars: false}', function (done) {
    const otp = CodeGenerator.generate(null, {
      digits: true,
      lowerCaseAlphabets: true,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log(otp);
    expect(otp).toHaveLength(10);
    expect(otp).toMatch(/^[0-9a-z]+$/);
    expect(otp).not.toMatch(/^[A-Z]+$/);
    expect(otp).not.toMatch(/^[#!&@]+$/);
    done();
  });

  it('it should return 10 digits and alphabets including upperCase when options is { specialChars: false}', function (done) {
    const otp = CodeGenerator.generate(null, {
      digits: true,
      lowerCaseAlphabets: true,
      upperCaseAlphabets: true,
      specialChars: false,
    });
    console.log(otp);
    expect(otp).toHaveLength(10);
    expect(otp).toMatch(/^[0-9a-zA-Z]+$/);
    expect(otp).not.toMatch(/^[#!&@]+$/);
    done();
  });

  it('it should return 10 digits, alphabets including uppercase and specialChars when options is { digits: true, lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: true}', function (done) {
    const otp = CodeGenerator.generate(null, {
      digits: true,
      lowerCaseAlphabets: true,
      upperCaseAlphabets: true,
      specialChars: true,
    });
    console.log(otp);
    expect(otp).toHaveLength(10);
    expect(otp).toMatch(/^[0-9a-zA-Z#!&@]+$/);
    done();
  });

  it('it should return 6 digits, lowerCaseAlphabets including uppercase and specialChars when options is { digits: true, lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: true}', function (done) {
    const otp = CodeGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: true,
      upperCaseAlphabets: true,
      specialChars: true,
    });
    console.log(otp);
    expect(otp).toHaveLength(6);
    expect(otp).toMatch(/^[0-9a-zA-Z#!&@]+$/);
    done();
  });
});
