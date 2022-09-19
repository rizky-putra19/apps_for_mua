import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, MaxLength, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { UpdateUser } from '@src/interface-adapters/interfaces/user/update-user.interface';
import { UserType } from '../../domain/enums/user-type.enum';
import { UserStatus } from '../../domain/enums/user-status.enum';

export class UpdateUserRequest implements UpdateUser {
    @ApiProperty({
      example: 'john@gmail.com',
      description: 'user email address',
      required: false,
    })
    @MaxLength(320)
    @IsEmail()
    @IsOptional()
    readonly email?: string;

    @ApiProperty({
        description: 'user password',
        required: false,
    })
    @MinLength(3)
    @IsOptional()
    readonly password?: string;
    
    @ApiProperty({
        description: 'user name',
        required: false,
    })
    @IsOptional()
    readonly name?: string;

    @ApiProperty({
        description: 'user type',
        required: true,
        enum: UserType,
    })
    @IsOptional()
    readonly type: UserType;

    @ApiProperty({
        description: 'user phone number',
        required: false,
    })
    @Expose({ name: 'phone_number' })
    @IsPhoneNumber()
    @IsOptional()
    readonly phoneNumber?: string;

    @ApiProperty({
        description: 'user status',
        required: true,
        enum: UserStatus,
    })
    @IsOptional()
    readonly status: UserStatus;
}