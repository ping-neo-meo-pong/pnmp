import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { RoleInChannel } from '../../../enum/role-in-channel.enum';

export class ChangeRoleInChannelDto {
  @ApiProperty({ enum: RoleInChannel })
  @IsEnum(RoleInChannel)
  readonly roleInChannel: RoleInChannel;
}
