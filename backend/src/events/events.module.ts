import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from '../api/auth/auth.module';
import { DmModule } from '../api/dm/dm.module';
import { UserModule } from '../api/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '../typeorm-ex.module';
import { DmRoomRepository } from '../core/dm/dm-room.repository';
import { DmRoom } from '../core/dm/dm-room.entity';
import { SocketModule } from '../core/socket/socket.module';

@Module({
  imports: [
    AuthModule,
    DmModule,
    UserModule,
    SocketModule,
    TypeOrmModule.forFeature([DmRoom]),
    TypeOrmExModule.forCustomRepository([
      DmRoomRepository,
    ]),
  ],
  providers: [EventsGateway],
})
export class EventsModule {}
