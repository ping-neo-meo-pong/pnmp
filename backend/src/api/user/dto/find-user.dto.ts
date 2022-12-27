import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly username?: string;
}
