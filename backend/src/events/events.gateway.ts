import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  WsException,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { emit } from 'process';
import { AuthService } from '../api/auth/auth.service';
import { DmRoomRepository } from '../core/dm/dm-room.repository';
import { DmService } from '../api/dm/dm.service';

function wsGuard(socket: any) {
  if (!socket.hasOwnProperty('user')) {
    socket.disconnect();
    throw new WsException('Not authorized');
	console.log('never');
  }
}

@WebSocketGateway({ transports: ['websocket'] })
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private dmRoomRepository: DmRoomRepository,
    private dmService: DmService,
  ) {}

  handleConnection(client: Socket) {
    console.log('connected');
  }

  handleDisconnect(client: Socket) {
    console.log('disconnected');
  }

  @SubscribeMessage('authorize')
  async authorize(@ConnectedSocket() socket: any, @MessageBody() jwt: string) {
    try {
      socket.user = this.authService.verifyToken(jwt);
      const dmRooms = await this.dmRoomRepository.getDmRooms(socket.user);
      for (let dmRoom of dmRooms)
        socket.join(dmRoom.id);
    } catch (err) {
      socket.disconnect();
    }
  }

  /*
  @SubscribeMessage('pleaseMakeRoom')
  makeRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
    client.join(roomId);
    client.emit('roomId', roomId);
    console.log(roomId);
  }
  */

  @SubscribeMessage('send_message')
  send_message(@ConnectedSocket() socket: any, @MessageBody() data: any) {
    wsGuard(socket);
    this.dmService.createDm({
      message: data.msg,
      dmRoomId: data.roomId,
      sendUserId: socket.user.id,
    });
    this.server.in(data.roomId).emit(`dmMsgEvent_${data.roomId}`, data.msg);
  }

  @SubscribeMessage('id')
  id_print(@MessageBody('id') data: number) {
    console.log(data);
  }
}
