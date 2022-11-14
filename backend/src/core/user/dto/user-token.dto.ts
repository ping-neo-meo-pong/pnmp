import { IsString } from 'class-validator';

export class UserTokenDto {
  @IsString()
  readonly userId: string;

  @IsString()
  readonly username: string;
}
