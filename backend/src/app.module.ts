import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { Score } from './core/Score.entity';
import { Role } from './core/Role.entity';
import { MatchingHistory } from './core/MathcingHistory.entity';
import { GameRoom } from './core/GameRoom.entity';
import { FriendList } from './core/FriendList.entity';
import { DmRoom } from './core/DmRoom.entity';
import { DmMessage } from './core/DmMessage.entity';
import { ChannelMessage } from './core/ChannelMessage.entity';
import { ChannelMember } from './core/ChannelMember.entity';
import { BanList } from './core/BanList.entity';
import { Channel } from './core/Channel.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: '4242',
      database: 'postgres',
      entities: [User, Score, Role, MatchingHistory, GameRoom,
        FriendList, DmRoom, DmMessage, ChannelMessage, ChannelMember, Channel,
      BanList],
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
