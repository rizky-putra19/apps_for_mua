import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterUserRequest {
  @ApiProperty({
    example: 'john@gmail.com',
    description: 'User email address',
  })
  @MaxLength(320)
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'user password',
  })
  @MinLength(3)
  readonly password: string;
  @ApiProperty({
    description: 'User name',
    required: false,
  })
  readonly name?: string;

  @ApiProperty({
    description: 'User type',
    required: true,
    enum: UserType,
  })
  @IsNotEmpty()
  readonly type: UserType;

  @Expose({ name: 'facebook_id' })
  readonly facebookId?: string;
  @Expose({ name: 'google_id' })
  readonly googleId?: string;
  readonly gender: string;
  readonly birthdate?: Date;
  readonly username?: string;
  readonly instagram?: string;
  readonly categories?: number[];
  @Expose({ name: 'apple_id' })
  readonly appleId?: string;
  @Expose({ name: 'challenge_token' })
  readonly challengeToken: string;
}
