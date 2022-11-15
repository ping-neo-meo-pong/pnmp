import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from '../api/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '../typeorm-ex.module';
import { DmRoomRepository } from '../core/dm/dm-room.repository';
import { DmRoom } from '../core/dm/dm-room.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([DmRoom]),
    TypeOrmExModule.forCustomRepository([
      DmRoomRepository,
    ]),
  ],
  providers: [EventsGateway],
})
export class EventsModule {}
