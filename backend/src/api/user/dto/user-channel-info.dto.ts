import { ChannelInfoDto } from '../../channel/dto/channel-info.dto';
import { IsString, IsBoolean } from 'class-validator';

export class UserChannelInfoDto extends ChannelInfoDto {
  @IsString()
  userRoleInChannel: string;

  @IsBoolean()
  userMute: boolean;
}
