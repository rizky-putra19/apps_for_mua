import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { CategoryStatus } from '../../domain/enums/category-status.enum';
export class UpdateCategoryRequest {
  @ApiProperty({
    description: 'category name',
    required: true,
  })
  @IsNotEmpty()
  @Length(3, 50)
  readonly name: string;

  @ApiProperty({
    description: 'category status',
    required: true,
  })
  @IsNotEmpty()
  @Length(3, 50)
  readonly status: CategoryStatus;

  @ApiProperty({
    description: 'category parent id',
  })
  @Expose({ name: 'parent_id' })
  @IsOptional()
  parentId?: number;
}
