import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class RestrictChannelDto {
  @ApiProperty({ type: Date })
  @IsDateString()
  readonly limitedTime: Date;
}
