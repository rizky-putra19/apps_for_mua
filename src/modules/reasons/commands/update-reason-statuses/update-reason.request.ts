import { ApiProperty } from '@nestjs/swagger';
import { ReasonType } from '../../domain/enums/reason-type.enum';

export class UpdateReasonRequest {
  @ApiProperty({
    description: 'reason status',
  })
  readonly reason: string;

  @ApiProperty({
    description: 'reason type',
  })
  readonly type: ReasonType;

  @ApiProperty({
    description: 'reason id',
  })
  readonly id: number;

  readonly description: string;
}
