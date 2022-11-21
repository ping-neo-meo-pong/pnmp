import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DuplicateUserDto {
  @ApiProperty()
  @IsString()
  readonly username: string;
}
