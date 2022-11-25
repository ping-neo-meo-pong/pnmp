import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../../core/user/user.repository';
import { User } from '../../core/user/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmExModule } from '../../typeorm-ex.module';
import { FriendRespository } from '../../core/friend/friend.repository';
import { BlockRepository } from '../../core/block/block.repository';
import { ChannelRepository } from '../../core/channel/channel.repository';
import { ChannelMemberRepository } from '../../core/channel/channel-member.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      FriendRespository,
      BlockRepository,
      ChannelRepository,
      ChannelMemberRepository,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
