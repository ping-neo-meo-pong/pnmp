import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Channel } from '../../../core/channel/channel.entity';

export class CreateChannelDto {
  @ApiProperty({ type: String })
  @IsString()
  readonly channelName: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  readonly isPublic: boolean;

  toChannelEntity() {
    const channel = new Channel();
    channel.channelName = this.channelName;
    channel.isPublic = this.isPublic;
    if (this.description) {
      channel.description = this.description;
    }
    if (this.password) {
      channel.password = this.password;
    }
    return channel;
  }
}
