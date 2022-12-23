import { IsBoolean, IsString, IsDate } from 'class-validator';
import { ChannelInfoDto } from './channel-info.dto';
import { User } from '../../../core/user/user.entity';

export class ChannelMessageDto {
  @IsString()
  id: string;

  @IsDate()
  createdAt: Date;

  @IsString()
  message: string;

  @IsBoolean()
  channelId: ChannelInfoDto;

  @IsBoolean()
  sendUserId: User;
}
