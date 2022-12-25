import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ChannelPasswordDto {
  @ApiProperty({ type: String || null })
  @IsString()
  @IsOptional()
  readonly password?: string | null;
}
