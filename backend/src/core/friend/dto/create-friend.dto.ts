import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from '../../user/user.entity';

export class CreateFriendDto {
  @IsString()
  readonly userId: User;

  @ApiProperty({ type: String })
  @IsString()
  readonly userFriendId: User;
}
