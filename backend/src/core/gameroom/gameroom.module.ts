import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRoomRepository } from './GameRoom.repository';
import { GameRoom } from './GameRoom.entity';
import { GameController } from '../../api/game/game.controller';
import { GameService } from '../../api/game/game.service';
import { TypeOrmExModule } from '../../typeorm-ex.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameRoom]),
    TypeOrmExModule.forCustomRepository([GameRoomRepository]),
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameRoomModule {}
