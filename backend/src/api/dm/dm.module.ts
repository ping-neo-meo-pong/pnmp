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
import { jwtConstants } from '../auth/auth.constants';
import { JwtStrategy } from '../auth/auth.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dm, DmRoom]),
    TypeOrmExModule.forCustomRepository([DmRepository, DmRoomRepository]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [DmController],
  providers: [DmService, JwtStrategy],
})
export class DmModule {}
