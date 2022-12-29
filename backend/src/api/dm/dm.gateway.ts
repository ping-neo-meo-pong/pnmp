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
import { DmRepository } from '../../core/dm/dm.repository';
import { DmRoomRepository } from '../../core/dm/dm-room.repository';
import { BlockRepository } from '../../core/block/block.repository';
import { DirectMessageDto } from './dto/direct-message.dto';
import { UserRepository } from '../../core/user/user.repository';

@WebSocketGateway({ namespace: 'dm', transports: ['websocket'] })
export class DmGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(DmRepository)
    private dmRepository: DmRepository,
    @InjectRepository(DmRoomRepository)
    private dmRoomRepository: DmRoomRepository,
    @InjectRepository(BlockRepository)
    private blockRepository: BlockRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  afterInit() {
    console.log('dm init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('dm connected');
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('dm disconnected');
  }

  @SubscribeMessage('dmRoom')
  async joinDmRoom(@ConnectedSocket() socket, @MessageBody() dmRoomId) {
    try {
      socket.join(dmRoomId);
    } catch (err) {
      socket.disconnect();
    }
  }

  @SubscribeMessage('dm')
  async onDmMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: DirectMessageDto,
  ) {
    const dmRoom = await this.dmRoomRepository.getDmRoomByRoomId(data.roomId);
    const user = await this.userRepository.findUserById(data.userId);
    const newDm = this.dmRepository.create({
      message: data.msg,
      dmRoomId: dmRoom,
      sendUserId: user,
    });
    await this.dmRepository.save(newDm);
    const newDmData = await this.dmRepository.findDmByDmId(newDm.id);
    const userId =
      data.userId === dmRoom.userId.id
        ? dmRoom.invitedUserId.id
        : dmRoom.userId.id;
    const isBlockUser = await this.blockRepository.didUserBlockOther(
      userId,
      data.userId,
    );
    if (isBlockUser) {
      this.server
        .in(data.roomId)
        .emit(`drawDm_${data.roomId}`, { ...newDmData, isSendUserBlocked: true });
    } else {
      this.server
        .in(data.roomId)
        .emit(`drawDm_${data.roomId}`, { ...newDmData, isSendUserBlocked: false });
    }
  }
}
