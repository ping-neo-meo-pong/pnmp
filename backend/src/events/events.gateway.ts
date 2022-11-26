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
import { UserSocket } from '../core/socket/dto/user-socket.dto';
import { SocketRepository } from '../core/socket/socket.repository';
import { JwtService } from '@nestjs/jwt';
import { DmRoomRepository } from '../core/dm/dm-room.repository';
import { DmRepository } from '../core/dm/dm.repository';
import { GameRoomRepository } from 'src/core/game/game-room.repository';

let index = 0;

let send_data = {
  game: {
    W: 700,
    H: 400,
    UD_d: 20,
    bar_d: 50,
  },
  ball: {
    x: 200,
    y: 200,
    v_x: 9,
    v_y: 8,
  },
  p1: {
    mouse_y: 0,
    score: 0,
  },
  p2: {
    mouse_y: 0,
    score: 0,
  },
}

const data = {
  roomId: {
    send_data,
  }
};

let loop: NodeJS.Timer;
let champ = 0;

function wsGuard(socket: UserSocket) {
  if (!socket.hasOwnProperty('user')) {
    socket.disconnect();
    throw new WsException('Not authorized');
  }
}

@WebSocketGateway({ transports: ['websocket'] })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private socketRepository: SocketRepository,
    private jwtService: JwtService,
    private dmRoomRepository: DmRoomRepository,
    private dmRepository: DmRepository,
    private gameRoomRepository: GameRoomRepository,
  ) { }

  handleConnection(socket: Socket) {
    console.log('connected');
  }

  handleDisconnect(socket: UserSocket) {
    console.log('disconnected');
    if (socket.hasOwnProperty('user'))
      this.socketRepository.delete(socket.user.id);
  }

  @SubscribeMessage('authorize')
  async authorize(
    @ConnectedSocket() socket: UserSocket,
    @MessageBody() jwt: string,
  ) {
    try {
      socket.user = this.jwtService.verify(jwt);
      this.socketRepository.save(socket.user.id, socket);
      const dmRooms = await this.dmRoomRepository.getDmRooms(socket.user.id);
      for (const dmRoom of dmRooms) socket.join(dmRoom.id);
    } catch (err) {
      socket.disconnect();
    }
  }

  @SubscribeMessage('dmMessage')
  onDmMessage(@ConnectedSocket() socket: UserSocket, @MessageBody() data: any) {
    wsGuard(socket);
    this.dmRepository.save({
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

  /////////////    game    //////////////
  @SubscribeMessage('comeInGameRoom')
  async comeCome(@ConnectedSocket() client: UserSocket, @MessageBody() _data: any) {
    wsGuard(client);

    data[_data.roomId] = send_data;
    
    // console.log("data[roomId]:");
    console.log(data[_data.roomId]);

    client.join(_data.roomId); // join

    client.emit('LR', 1);
    const TYPE = 1;
    // await this.gameRoomRepository.findOne({
    //   relations: ['leftUserId', 'rightUserId'],
    //   where: [
    //     {
    //       leftUserId: { id: client.id },
    //     },
    //     {
    //       rightUserId: { id: client.id },
    //     },
    //   ],
    // }); // find LR & send

    if (TYPE) {
      clearInterval(loop);
      loop = setInterval(() => {
        // this.server.emit('game_data', data);
        this.server.in(_data.roomId).emit(`game[${_data.roomId}]`, data[_data.roomId]);

        ball_engine(_data.roomId);
      }, 1000 / 30);
    }
  }
  @SubscribeMessage('p1')
  p1(@ConnectedSocket() client: UserSocket, @MessageBody() _data) {
    wsGuard(client);
    console.log("p1 _data:");
    console.log(_data);
    console.log(data[_data.roomId]);
    data[_data.roomId].p1.mouse_y.set(_data.m_y);// = _data.m_y;
  }
  @SubscribeMessage('p2')
  p2(@ConnectedSocket() client: UserSocket, @MessageBody() _data) {
    wsGuard(client);
    data[_data.roomId].p2.mouse_y = _data.m_y;
  }
  @SubscribeMessage('gameOut')
  gameOut(@ConnectedSocket() client: UserSocket) {
    wsGuard(client);
    clearInterval(loop);
    // if (champ == 2) champ = 1;
    // else if (champ == 1) champ = 0;
    console.log(`game out : ${champ}`);
  }
}

function ball_engine(roomId: string) {
  check_wall(roomId);
  check_bar(roomId);

  data[roomId].ball.x += data[roomId].ball.v_x;
  data[roomId].ball.y += data[roomId].ball.v_y;
}

function check_wall(roomId: string) {
  if (data[roomId].ball.x + data[roomId].ball.v_x > data[roomId].game.W - 20) {
    // right
    data[roomId].ball.v_x *= -1;
    data[roomId].p1.score += 1;
  } else if (data[roomId].ball.x + data[roomId].ball.v_x < 0) {
    // left
    data[roomId].ball.v_x *= -1;
    data[roomId].p2.score += 1;
  }
  if (data[roomId].ball.y + data[roomId].ball.v_y > data[roomId].game.H - data[roomId].game.UD_d - 20) {
    // down
    data[roomId].ball.v_y *= -1;
  } else if (data[roomId].ball.y + data[roomId].ball.v_y < data[roomId].game.UD_d) {
    // up
    data[roomId].ball.v_y *= -1;
  }
}

function check_bar(roomId: string) {
  if (
    data[roomId].ball.x + data[roomId].ball.v_x > data[roomId].game.bar_d &&
    data[roomId].ball.x + data[roomId].ball.v_x < data[roomId].game.bar_d + 20 &&
    Math.abs(data[roomId].ball.y + data[roomId].ball.v_y - data[roomId].p1.mouse_y) < 40
  ) {
    data[roomId].ball.v_x = Math.abs(data[roomId].ball.v_x);
  } else if (
    data[roomId].ball.x + data[roomId].ball.v_x < data[roomId].game.W - data[roomId].game.bar_d - 20 &&
    data[roomId].ball.x + data[roomId].ball.v_x > data[roomId].game.W - data[roomId].game.bar_d - 40 &&
    Math.abs(data[roomId].ball.y + data[roomId].ball.v_y - data[roomId].p2.mouse_y) < 40
  ) {
    if (data[roomId].ball.v_x > 0) data[roomId].ball.v_x *= -1;
  }
}
