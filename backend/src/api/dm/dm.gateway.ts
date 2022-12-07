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

  //   @SubscribeMessage('authorize')
  //   async authorize(
  //     @ConnectedSocket() socket: Socket,
  //     @MessageBody() loginUser: any,
  //   ) {
  //     try {
  //       const dmRooms = await this.dmRoomRepository.getDmRooms(loginUser.id);
  //       for (const dmRoom of dmRooms) socket.join(dmRoom.id);
  //     } catch (err) {
  //       socket.disconnect();
  //     }
  //   }

  //   @SubscribeMessage('dmRooms')
  //   async joinDmRooms(@ConnectedSocket() socket, @MessageBody() dmRooms) {
  //     try {
  //       console.log(dmRooms);
  //       for (const dmRoom of dmRooms) socket.join(dmRoom.id);
  //     } catch (err) {
  //       socket.disconnect();
  //     }
  //   }

  @SubscribeMessage('dmRoom')
  async joinDmRoom(@ConnectedSocket() socket, @MessageBody() dmRoomId) {
    try {
      console.log(dmRoomId);
      socket.join(dmRoomId);
    } catch (err) {
      socket.disconnect();
    }
  }

  @SubscribeMessage('dm')
  async onDmMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ) {
    const newDm = this.dmRepository.create({
      message: data.msg,
      dmRoomId: data.roomId,
      sendUserId: data.userId,
    });
    await this.dmRepository.save(newDm);
    const newDmData = await this.dmRepository.findOne({
      relations: ['dmRoomId', 'sendUserId'],
      where: {
        id: newDm.id,
      },
    });
    this.server.in(data.roomId).emit(`drawDm`, newDmData);
    console.log(socket.id, socket.nsp.name);
    console.log(data);
  }

  //   @SubscribeMessage('id')
  //   id_print(@MessageBody('id') data: number) {
  //     console.log(data);
  //   }
}
