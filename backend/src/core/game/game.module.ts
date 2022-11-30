import { Module } from '@nestjs/common';
import { GameRoomRepository } from './game-room.repository';

@Module({
  providers: [GameRoomRepository],
  exports: [GameRoomRepository],
})
export class GameModule {}
