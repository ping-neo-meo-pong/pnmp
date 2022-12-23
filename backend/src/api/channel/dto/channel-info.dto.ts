import { IsBoolean, IsString } from 'class-validator';

export class ChannelInfoDto {
  @IsString()
  id: string;

  @IsString()
  channelName: string;

  @IsString()
  description: string;

  @IsBoolean()
  hasPassword: boolean;

  @IsBoolean()
  isPublic: boolean;
}
