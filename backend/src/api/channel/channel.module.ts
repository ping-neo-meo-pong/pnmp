import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelRepository } from '../../core/channel/channel.repository';
import { Channel } from '../../core/channel/channel.entity';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { TypeOrmExModule } from '../../typeorm-ex.module';
import { ChannelMember } from '../../core/channel/channel-member.entity';
import { ChannelMessage } from '../../core/channel/channel-message.entity';
import { ChannelMemberRepository } from '../../core/channel/channel-member.repository';
import { ChannelMessageRepository } from '../../core/channel/channel-message.repository';
import { UserRepository } from '../../core/user/user.repository';
import { BlockRepository } from '../../core/block/block.repository';
// import { ChannelGateway } from './channel.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, ChannelMember, ChannelMessage]),
    TypeOrmExModule.forCustomRepository([
      ChannelRepository,
      ChannelMemberRepository,
      ChannelMessageRepository,
      UserRepository,
      BlockRepository,
    ]),
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
