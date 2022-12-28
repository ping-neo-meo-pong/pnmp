import { GameMode } from '../../../enum/game-mode.enum';
import { UserInfoDto } from '../../user/dto/user-info.dto';

export class GameRoomInfoDto {
  id: string;
  leftUser: UserInfoDto;
  rightUser: UserInfoDto;
  startAt: Date;
  gameMode: GameMode;
}
