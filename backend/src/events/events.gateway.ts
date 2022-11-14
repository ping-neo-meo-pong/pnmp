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
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { emit } from 'process';

@WebSocketGateway({ transports: ['websocket'] })
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;
  logger: Logger = new Logger('EventsGateway');

  afterInit(server: Server) {
    console.count('Init');
  }
  handleDisconnect(client: Socket) {
    console.log(`disconnect ${client}`);
  }
  //   @SubscribeMessage('events')
  //   findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //     return from([1, 2, 3]).pipe(
  //       map((item) => ({ event: 'events', data: item })),
  //     );
  //   }
  //   @SubscribeMessage('identity')
  //   async identity(@MessageBody() data: number): Promise<number> {
  //     return data;
  //   }
  handleConnection(client: Socket) {
    console.log(`connect ${client.id}`);
  }
  @SubscribeMessage('pleaseMakeRoom')
  makeRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
    client.join(roomId);
    client.emit('roomId', roomId);
    console.log(roomId);
  }
  @SubscribeMessage('send_message')
  send_message(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`);
    console.log(data);
    // client.in(data[0]).emit('server_message', data[1]);
    console.log(data[0]);
    this.server.in(data[0]).emit('server_message', data[1]);
  }
  @SubscribeMessage('id')
  id_print(@MessageBody('id') data: number) {
    console.log(data);
  }
}
