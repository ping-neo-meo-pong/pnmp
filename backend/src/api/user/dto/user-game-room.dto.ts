import { IsString, IsDate, IsEnum } from 'class-validator';
import { GameMode } from 'src/enum/game-mode.enum';

export class UserGameRoomDto {
  @IsString()
  id: string;

  @IsEnum(GameMode)
  gameMode: GameMode;

  @IsDate()
  startAt: Date;

  @IsDate()
  endAt: Date;
}
