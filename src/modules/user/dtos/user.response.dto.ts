import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/response.base';
import { CategoryOrmEntity } from '@src/modules/category/database/category.orm-entity';
import { CategoryEntity } from '@src/modules/category/domain/entities/category.entity';
import { CategoryResponse } from '@src/modules/category/dtos/category.dto';
import { Expose } from 'class-transformer';
import { UserEntity } from '../domain/entities/user.entity';
import { UserType } from '../domain/enums/user-type.enum';

export class UserResponse extends ResponseBase {
  @ApiProperty({
    example: 'joh-doe@gmail.com',
    description: "User's email address",
  })
  readonly email: string;
  @ApiProperty({
    description: 'User name',
  })
  readonly name?: string;

  @ApiProperty({
    description: 'User phone number',
  })
  @Expose({ name: 'phone_number' })
  readonly phoneNumber?: string;
  @ApiProperty({
    description: 'User facebook identifier',
  })
  @Expose({ name: 'facebook_id' })
  readonly facebookId?: string;
  @ApiProperty({
    description: 'User google identifier',
  })
  @Expose({ name: 'google_id' })
  readonly googleId?: string;

  @Expose({ name: 'legacy_id' })
  readonly legacyId?: number;

  readonly type: UserType;
  readonly status: string;

  metadata: { [key: string]: string }[];

  readonly avatar?: string;
  readonly username?: string;
  readonly isFavorite?: boolean;
  readonly favorite?: number;
  readonly jobDone?: number;
  readonly rating?: number;
  readonly category?: CategoryEntity[];

  constructor(user: UserEntity) {
    super(user);
    const props = user.getPropsCopy();
    this.email = props.email;
    this.name = props.name;
    this.username = props.username;
    this.status = props.status;
    this.facebookId = props.facebookId;
    this.googleId = props.googleId;
    this.phoneNumber = props.phoneNumber;
    this.legacyId = props.legacyId;
    this.type = props.type;
    this.metadata = props.metadata.map((m) => {
      return {
        [m.name]: m.value,
      };
    });
    this.avatar = props.avatar?.getPropsCopy().url;
    this.isFavorite = props.isFavorite;
    this.favorite = props.favorite;
    this.jobDone = props.jobDone;
    this.rating = props.rating;
    this.category = props.category?.map(
      (c) => new CategoryResponse(CategoryEntity.convertToOrmEntity(c)),
    );
  }
}
