import { IsString, IsOptional } from 'class-validator';
import { User } from '../../user/user.entity';

export class CreateDmRoomDto {
  @IsOptional()
  @IsString()
  userId: User;

  @IsString()
  readonly invitedUserId: User;
}
