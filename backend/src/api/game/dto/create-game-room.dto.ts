import { IsString, IsOptional, IsEnum } from 'class-validator';
import { User } from 'src/core/user/user.entity';
import { GameMode } from '../../../enum/game-mode.enum';

export class CreateGameRoomDto {
  @IsOptional()
  @IsString()
  leftUserId?: User;

  @IsString()
  readonly rightUserId: User;

  @IsOptional()
  @IsEnum(GameMode)
  gameMode?: GameMode;
}
