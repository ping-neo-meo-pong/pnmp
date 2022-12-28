import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '../typeorm-ex.module';
import { DmRoomRepository } from '../core/dm/dm-room.repository';
import { DmRepository } from '../core/dm/dm.repository';
import { DmRoom } from '../core/dm/dm-room.entity';
import { SocketModule } from '../core/socket/socket.module';
import { JwtModule } from '@nestjs/jwt';
import { GameModule } from 'src/core/game/game.module';
import { UserRepository } from 'src/core/user/user.repository';
import { GameHistoryRepository } from 'src/core/game/game-history.repository';

import { ChannelMessageRepository } from 'src/core/channel/channel-message.repository'; // added
import { ChannelMemberRepository } from 'src/core/channel/channel-member.repository';
import { ChannelRepository } from 'src/core/channel/channel.repository';
import { BlockRepository } from 'src/core/block/block.repository';

@Module({
  imports: [
    SocketModule,
    GameModule,
    TypeOrmModule.forFeature([DmRoom]),
    TypeOrmExModule.forCustomRepository([
      DmRoomRepository,
      DmRepository,
      UserRepository,
      GameHistoryRepository,
      ChannelMessageRepository,
      ChannelMemberRepository,
      ChannelRepository,
      BlockRepository,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRED },
    }),
  ],
  providers: [EventsGateway],
})
export class EventsModule {}
