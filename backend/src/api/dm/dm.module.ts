import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmRepository } from '../../core/dm/dm.repository';
import { Dm } from '../../core/dm/dm.entity';
import { DmRoom } from '../../core/dm/dm-room.entity';
import { DmController } from './dm.controller';
import { DmService } from './dm.service';
import { TypeOrmExModule } from '../../typeorm-ex.module';
import { DmRoomRepository } from '../../core/dm/dm-room.repository';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from '../../core/user/user.repository';
import { SocketModule } from '../../core/socket/socket.module';

@Module({
  imports: [
    SocketModule,
    TypeOrmModule.forFeature([Dm, DmRoom]),
    TypeOrmExModule.forCustomRepository([
      DmRepository,
      DmRoomRepository,
      UserRepository,
    ]),
  ],
  controllers: [DmController],
  providers: [DmService],
})
export class DmModule {}
