import { IsNumber, IsString, IsEnum } from 'class-validator';
import { UserStatus } from '../../../enum/user-status';

export class UserInfoDto {
  @IsString()
  id: string;

  @IsString()
  username: string;

  @IsString()
  profileImage: string;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsNumber()
  ladder: number;
}
