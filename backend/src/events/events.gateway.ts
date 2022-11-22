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

const data = {
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
      const dmRooms = await this.dmRoomRepository.getDmRooms(socket.user);
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

  @SubscribeMessage('im_gamer')
  im_gamer(@ConnectedSocket() client: UserSocket) {
    wsGuard(client);
    client.on('disconnect', () => {
      clearInterval(loop);
      // if (champ > 0) champ--;
      console.log(`disconnected: ${client.id}`);
    });
    if (champ < 2) {
      champ++;
    }
    console.log('send LR!');
    client.emit('LR', champ);
    if (champ >= 2) {
      clearInterval(loop);
      loop = setInterval(() => {
        this.server.emit('game_data', data);

        if (champ >= 2) {
          ball_engine();
        }
      }, 1000 / 30);
    }
  }
  @SubscribeMessage('p1')
  p1(@ConnectedSocket() client: UserSocket, @MessageBody() m_y: number) {
    wsGuard(client);
    data.p1.mouse_y = m_y;
  }
  @SubscribeMessage('p2')
  p2(@ConnectedSocket() client: UserSocket, @MessageBody() m_y: number) {
    wsGuard(client);
    data.p2.mouse_y = m_y;
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

function ball_engine() {
  check_wall();
  check_bar();

  // data.ball.old_x = data.ball.x;
  // data.ball.old_y = data.ball.y;
  data.ball.x += data.ball.v_x;
  data.ball.y += data.ball.v_y;
}

function check_wall() {
  if (data.ball.x + data.ball.v_x > data.game.W - 20) {
    // right
    data.ball.v_x *= -1;
    data.p1.score += 1;
  } else if (data.ball.x + data.ball.v_x < 0) {
    // left
    data.ball.v_x *= -1;
    data.p2.score += 1;
  }
  if (data.ball.y + data.ball.v_y > data.game.H - data.game.UD_d - 20) {
    // down
    data.ball.v_y *= -1;
  } else if (data.ball.y + data.ball.v_y < data.game.UD_d) {
    // up
    data.ball.v_y *= -1;
  }
}

function check_bar() {
  if (
    data.ball.x + data.ball.v_x > data.game.bar_d &&
    data.ball.x + data.ball.v_x < data.game.bar_d + 20 &&
    Math.abs(data.ball.y + data.ball.v_y - data.p1.mouse_y) < 40
  ) {
    data.ball.v_x = Math.abs(data.ball.v_x);
  } else if (
    data.ball.x + data.ball.v_x < data.game.W - data.game.bar_d - 20 &&
    data.ball.x + data.ball.v_x > data.game.W - data.game.bar_d - 40 &&
    Math.abs(data.ball.y + data.ball.v_y - data.p2.mouse_y) < 40
  ) {
    if (data.ball.v_x > 0) data.ball.v_x *= -1;
  }
}
