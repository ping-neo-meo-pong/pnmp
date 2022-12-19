import { InjectRepository } from '@nestjs/typeorm';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelMessageRepository } from '../../core/channel/channel-message.repository';
import { ChannelMemberRepository } from 'src/core/channel/channel-member.repository';
import { ChannelRepository } from '../../core/channel/channel.repository';
import { BlockRepository } from '../../core/block/block.repository';
import { UserRepository } from 'src/core/user/user.repository';

@WebSocketGateway({ namespace: 'channel', transports: ['websocket'] })
export class ChannelGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(ChannelMessageRepository)
    private channelMessageRepository: ChannelMessageRepository,
    @InjectRepository(ChannelMemberRepository)
    private channelMemberRepository: ChannelMemberRepository,
    @InjectRepository(ChannelRepository)
    private channelRepository: ChannelRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(BlockRepository)
    private blockRepository: BlockRepository,
  ) {}

  afterInit() {
    console.log('channel init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('channel connected');
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('channel disconnected');
  }

  @SubscribeMessage('channelRoom')
  async joinChannelRoom(
    @ConnectedSocket() socket,
    @MessageBody() channelRoomId,
  ) {
    try {
      // 지금은 그냥 조인
      console.log(`join	하오`);
      console.log(channelRoomId);
      socket.join(channelRoomId);
    } catch (err) {
      socket.disconnect();
    }
  }

  @SubscribeMessage('channelMessage')
  async onChannelMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ) {
    const newChannelMessage = this.channelMessageRepository.create({
      message: data.msg,
      channelId: data.roomId,
      sendUserId: data.userId,
    });
    await this.channelMessageRepository.save(newChannelMessage);
    console.log(`cm save 했소`);
    const newChannelMessageData = await this.channelMessageRepository.findOne({
      relations: ['channelId', 'sendUserId'],
      where: {
        id: newChannelMessage.id,
      },
    });
    // const blockUsers = await this.userRepository.findOneBy({ id: socket.id });
    console.log(`cm room ${data.roomId}에 송구하오`);
    this.server.in(data.roomId).emit(`drawChannelMessage`, {
      ...newChannelMessageData, // 일단 block유저 찾지않음
    });
  }
}
