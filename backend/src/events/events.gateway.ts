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
import { UserService } from '../api/user/user.service';

function wsGuard(socket: any) {
  if (!socket.hasOwnProperty('user')) {
    socket.disconnect();
    throw new WsException('Not authorized');
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
    private userService: UserService,
  ) {}

  handleConnection(socket: Socket) {
    console.log('connected');
  }

  handleDisconnect(socket: any) {
    console.log('disconnected');
    if (socket.hasOwnProperty('user'))
      this.userService.deleteSocket(socket.user.id);
  }

  @SubscribeMessage('authorize')
  async authorize(@ConnectedSocket() socket: any, @MessageBody() jwt: string) {
    try {
      socket.user = this.authService.verifyToken(jwt);
      this.userService.setSocket(socket.user.id, socket);
      const dmRooms = await this.dmRoomRepository.getDmRooms(socket.user);
      for (let dmRoom of dmRooms)
        socket.join(dmRoom.id);
    } catch (err) {
      socket.disconnect();
    }
  }

  @SubscribeMessage('dmMessage')
  onDmMessage(@ConnectedSocket() socket: any, @MessageBody() data: any) {
    wsGuard(socket);
    this.dmService.createDm({
      message: data.msg,
      dmRoomId: data.roomId,
      sendUserId: socket.user.id,
    });
    this.server.in(data.roomId).emit(`dmMsgEvent_${data.roomId}`, data.msg);
  }
}
