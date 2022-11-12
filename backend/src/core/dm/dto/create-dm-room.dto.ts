import { IsString, IsOptional } from 'class-validator';
import { User } from '../../user/user.entity';

export class CreateDmRoomDto {
  @IsString()
  readonly userId: User;

  @IsString()
  readonly invitedUserId: User;

  @IsOptional()
  @IsString()
  readonly createdId: string;

  @IsOptional()
  @IsString()
  readonly updatedId: string;
}
