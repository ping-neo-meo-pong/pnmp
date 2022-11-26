import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString } from 'class-validator';

export class RestrictChannelDto {
  //   @ApiProperty({ type: String })
  //   @IsDate()
  //   readonly targetId: string;

  @ApiProperty({ type: Date })
  @IsDateString()
  readonly limitedTime: Date;
}
