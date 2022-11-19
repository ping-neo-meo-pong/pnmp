import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmRepository } from '../../core/dm/dm.repository';
import { Dm } from '../../core/dm/dm.entity';
import { DmRoom } from '../../core/dm/dm-room.entity';
import { DmController } from './dm.controller';
import { DmService } from './dm.service';
import { TypeOrmExModule } from '../../typeorm-ex.module';
import { DmRoomRepository } from '../../core/dm/dm-room.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UserRepository } from '../../core/user/user.repository';
import { UserModule } from '../../api/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dm, DmRoom]),
    TypeOrmExModule.forCustomRepository([
      DmRepository,
      DmRoomRepository,
      UserRepository,
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRED },
    }),
    UserModule,
  ],
  controllers: [DmController],
  providers: [DmService, JwtStrategy],
  exports: [DmService],
})
export class DmModule {}
