import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class LoginUserInfoDto {
  @IsOptional()
  @IsString()
  readonly id?: string;

  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsOptional()
  @IsString()
  readonly profileImage?: string;

  @IsOptional()
  @IsBoolean()
  readonly firstLogin?: boolean;

  @IsOptional()
  @IsNumber()
  readonly iat?: number;

  @IsOptional()
  @IsNumber()
  readonly exp?: number;

  @IsOptional()
  @IsString()
  readonly accessToken?: string;
}
