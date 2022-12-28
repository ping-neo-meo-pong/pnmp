import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRoom } from '../../core/game/game-room.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmExModule } from '../../typeorm-ex.module';
import { GameHistory } from '../../core/game/game-history.entity';
import { GameHistoryRepository } from '../../core/game/game-history.repository';
import { UserRepository } from 'src/core/user/user.repository';
import { SocketModule } from 'src/core/socket/socket.module';
import { GameModule as _GameModule } from 'src/core/game/game.module';
import { GameQueueRepository } from 'src/core/game/game-queue.repository';

@Module({
  imports: [
    SocketModule,
    _GameModule,
    TypeOrmModule.forFeature([GameRoom, GameHistory]),
    TypeOrmExModule.forCustomRepository([
      GameHistoryRepository,
      UserRepository,
      GameQueueRepository,
    ]),
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
