import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OtpDto {
  @ApiProperty()
  @IsString()
  readonly otp: string;
}
