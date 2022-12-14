import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmRepository } from '../../core/dm/dm.repository';
import { Dm } from '../../core/dm/dm.entity';
import { DmRoom } from '../../core/dm/dm-room.entity';
import { DmController } from './dm.controller';
import { DmService } from './dm.service';
import { TypeOrmExModule } from '../../typeorm-ex.module';
import { DmRoomRepository } from '../../core/dm/dm-room.repository';
import { UserRepository } from '../../core/user/user.repository';
import { SocketModule } from '../../core/socket/socket.module';
import { DmGateway } from './dm.gateway';
import { BlockRepository } from '../../core/block/block.repository';

@Module({
  imports: [
    SocketModule,
    TypeOrmModule.forFeature([Dm, DmRoom]),
    TypeOrmExModule.forCustomRepository([
      DmRepository,
      DmRoomRepository,
      UserRepository,
      BlockRepository,
    ]),
  ],
  controllers: [DmController],
  providers: [DmService, DmGateway],
})
export class DmModule {}
