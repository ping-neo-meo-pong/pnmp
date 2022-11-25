import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ChannelPasswordDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  readonly password?: string | null;
}
