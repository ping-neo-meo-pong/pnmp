import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { User } from '../../user/user.entity';

export class CreateDmRoomDto {
  @IsOptional()
  @IsString()
  userId: User;

  @ApiProperty({ type: String })
  @IsString()
  readonly invitedUserId: User;
}
