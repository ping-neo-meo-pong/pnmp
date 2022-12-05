import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from '../api/auth/auth.module';
import { DmModule } from '../api/dm/dm.module';
import { UserModule } from '../api/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '../typeorm-ex.module';
import { DmRoomRepository } from '../core/dm/dm-room.repository';
import { DmRepository } from '../core/dm/dm.repository';
import { DmRoom } from '../core/dm/dm-room.entity';
import { SocketModule } from '../core/socket/socket.module';
import { JwtModule } from '@nestjs/jwt';
import { GameRoomRepository } from 'src/core/game/game-room.repository';
import { GameModule } from 'src/core/game/game.module';
import { GameQueueRepository } from 'src/core/game/game-queue.repository';
import { UserRepository } from 'src/core/user/user.repository';

@Module({
  imports: [
    SocketModule,
    GameModule,
    TypeOrmModule.forFeature([DmRoom]),
    TypeOrmExModule.forCustomRepository([
      DmRoomRepository,
      DmRepository,
      UserRepository,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRED },
    }),
  ],
  providers: [EventsGateway],
})
export class EventsModule {}
