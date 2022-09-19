import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { CategoryStatus } from '../../domain/enums/category-status.enum';
export class UpdateCategoryStatusRequest {
  @ApiProperty({
    description: 'category status',
    required: true,
  })
  @IsNotEmpty()
  @Length(3, 50)
  readonly status: CategoryStatus;
}
