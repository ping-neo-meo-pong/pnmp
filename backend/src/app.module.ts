import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { Score } from './core/score/Score.entity';
import { Role } from './core/role/Role.entity';
import { MatchingHistory } from './core/matchingHistory/MathcingHistory.entity';
import { GameRoom } from './core/gameroom/GameRoom.entity';
import { FriendList } from './core/friendlist/FriendList.entity';
import { DmRoom } from './core/dm/DmRoom.entity';
import { DmMessage } from './core/dm/DmMessage.entity';
import { ChannelMessage } from './core/channel/ChannelMessage.entity';
import { ChannelMember } from './core/channel/ChannelMember.entity';
import { BanList } from './core/banlist/BanList.entity';
import { Channel } from './core/channel/Channel.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_CONTAINER_PORT, 10) || 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
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
