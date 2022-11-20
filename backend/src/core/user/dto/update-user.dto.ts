import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  readonly twoFactorAuth: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly profileImage: string;
}
