import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, isNotEmpty, IsOptional } from 'class-validator';

export class FindUserRequest {
  @IsNotEmpty()
  readonly identifier: string;
  @IsNotEmpty()
  readonly type?: string;
  @IsNotEmpty()
  @Expose({ name: 'find_type' })
  readonly findType: 'email' | 'legacyId' | 'id' | 'phoneNumber' | 'username';
}
