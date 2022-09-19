import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ReasonType } from '../../domain/enums/reason-type.enum';

export class CreateReasonRequest {
  @ApiProperty({
    description: 'reason status',
    required: true,
  })
  @IsNotEmpty()
  readonly reason: string;

  @ApiProperty({
    description: 'reason type',
  })
  readonly type: ReasonType;

  readonly description: string;
}
