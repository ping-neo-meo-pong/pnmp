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

const data = {
  game: {
    W: 400,
    H: 700,
    bar_d: 50,
    UD_d: 20,
  },
  ball: {
    x: 0,
    y: 0,
    v_x: 0,
    v_y: 0,
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
let champ: 0;

function wsGuard(socket: any) {
  if (!socket.hasOwnProperty('user')) {
    socket.disconnect();
    throw new WsException('Not authorized');
    console.log('never');
  }
}

@WebSocketGateway({ transports: ['websocket'] })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
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
      for (let dmRoom of dmRooms) socket.join(dmRoom.id);
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

  @SubscribeMessage('im_gamer')
  im_gamer(@ConnectedSocket() client: Socket) {
    wsGuard(client);
    client.on('disconnect', () => {
      clearInterval(loop);
      if (champ > 0) champ--;
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
        console.log(data);
        console.log(champ);
        // for (let i=0; i < 100; i++)
        // 	console.log(client);

        if (champ >= 2) {
          ball_engine();
        }
      }, 1000 / 30);
    }
  }
  @SubscribeMessage('p1')
  p1(@ConnectedSocket() client: Socket, @MessageBody() m_y: number) {
    wsGuard(client);
    // data.mouse_x = m_x;
    data.p1.mouse_y = m_y;
  }
  @SubscribeMessage('p2')
  p2(@ConnectedSocket() client: Socket, @MessageBody() m_y: number) {
    wsGuard(client);
    // data.mouse_x = m_x;
    data.p2.mouse_y = m_y;
  }
  @SubscribeMessage('gameOut')
  gameOut(@ConnectedSocket() client: Socket) {
    wsGuard(client);
    clearInterval(loop);
    if (champ > 0) champ--;
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
