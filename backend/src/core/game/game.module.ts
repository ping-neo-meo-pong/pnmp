import { Module } from '@nestjs/common';
import { GameQueueRepository } from './game-queue.repository';
import { GameRoomRepository } from './game-room.repository';
import { UserRepository } from '../user/user.repository';
import { TypeOrmExModule } from '../../typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
    ]),
  ],
  providers: [GameRoomRepository, GameQueueRepository],
  exports: [GameRoomRepository, GameQueueRepository],
})
export class GameModule { }
