import { IsString, IsDate, IsObject } from 'class-validator';
import { UserInfoDto } from './user-info.dto';

export class UserFriendInfoDto {
  @IsString()
  id: string;

  @IsDate()
  requestAt: Date;

  @IsDate()
  acceptAt: Date;

  @IsObject()
  userId: UserInfoDto;

  @IsObject()
  userFriendId: UserInfoDto;
}
