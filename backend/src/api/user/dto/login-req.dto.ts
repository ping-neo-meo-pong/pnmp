import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginReqDto {
  @ApiProperty()
  @IsString()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly accessToken: string;
}
