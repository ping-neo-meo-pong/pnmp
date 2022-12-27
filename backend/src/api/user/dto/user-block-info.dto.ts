import { IsString, IsDate, IsObject } from 'class-validator';
import { UserInfoDto } from './user-info.dto';

export class UserBlockInfoDto {
  @IsString()
  id: string;

  @IsDate()
  blockAt: Date;

  @IsObject()
  userId: UserInfoDto;

  @IsObject()
  blockedUserId: UserInfoDto;
}
