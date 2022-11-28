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

// let index = 0;

const game = {
  W: 700,
  H: 400,
  UD_d: 20,
  bar_d: 50,
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

const data: any[] = [];

let loop: NodeJS.Timer;
const champ = 0;

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
  ) {}

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

  /////////////    game    ///////////////

  @SubscribeMessage('comeInGameRoom')
  async comeCome(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() roomId: string,
  ) {
    wsGuard(client);

    // for (let i = 0; i < data.length(); i++) {
    //   console.log(test);
    // }

    client.join(roomId); // join

    const test = await this.gameRoomRepository.findOne({
      relations: ['leftUserId', 'rightUserId'],
      where: [
        {
          leftUserId: { id: client.user.id },
        },
        {
          rightUserId: { id: client.user.id },
        },
      ],
    }); // find LR & send
    console.log('test:');
    console.log(test);

    if (!data[roomId]) {
      data[roomId] = { roomId: roomId, game: initGame(), champ: 0 };
    }
    for (const test in data) {
      // for roomId
      console.log(data[test]);
    }
    // console.log(data);

    // console.log('id');
    // console.log(test.leftUserId.id);
    // console.log(client.user.id);
    //   if user == L ? R
    if (test.leftUserId.id == client.user.id) {
      client.emit('LR', 1);
      data[roomId].champ++;
      console.log('you are LEFT');
      console.log(data[roomId].champ);
    } else if (test.rightUserId.id == client.user.id) {
      client.emit('LR', 2);
      data[roomId].champ++;
      console.log('you are RIGHT');
      console.log(data[roomId].champ);
    }

    // if user L & R
    if (data[roomId].champ == 2) {
      // if user L & R
      clearInterval(loop);
      loop = setInterval(() => {
        for (const i in data) {
          console.log(data[i]);
          this.server
            .in(data[i].roomId)
            .emit(`game[${data[i].roomId}]`, data[i].game);
          //   console.log(`game[${gameRoom.roomId}]`);
          ball_engine(data[i].roomId);
        } // https://velog.io/@lilyoh/js-object-%EC%9A%94%EC%86%8C%EC%97%90-%EC%A0%91%EA%B7%BC%ED%95%98%EA%B3%A0-%EC%88%9C%ED%9A%8C%ED%95%98%EA%B8%B0
      }, 1000 / 30);
    }
  }
  @SubscribeMessage('p1')
  p1(@ConnectedSocket() client: UserSocket, @MessageBody() _data) {
    wsGuard(client);
    data[_data.roomId].game.p1.mouse_y = _data.m_y;
    // console.log('data[roomId]');
    // console.log(data[_data.roomId]);
  }
  @SubscribeMessage('p2')
  p2(@ConnectedSocket() client: UserSocket, @MessageBody() _data) {
    wsGuard(client);
    data[_data.roomId].game.p2.mouse_y = _data.m_y;
  }
  @SubscribeMessage('gameOut')
  gameOut(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() roomId: string,
  ) {
    wsGuard(client);
    // clearInterval(loop);
    // if (champ == 2) champ = 1;
    // else if (champ == 1) champ = 0;
    console.log(`game out : ${champ}`);
  }
}

function ball_engine(roomId: string) {
  check_wall(roomId);
  check_bar(roomId);

  data[roomId].game.ball.x += data[roomId].game.ball.v_x;
  data[roomId].game.ball.y += data[roomId].game.ball.v_y;
}

function initGame() {
  return {
    W: 500,
    H: 400,
    UD_d: 20,
    bar_d: 50,
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
}

function check_wall(roomId: string) {
  if (
    data[roomId].game.ball.x + data[roomId].game.ball.v_x >
    data[roomId].game.W - 20
  ) {
    // right
    data[roomId].game.ball.v_x *= -1;
    data[roomId].game.p1.score += 1;
  } else if (data[roomId].game.ball.x + data[roomId].game.ball.v_x < 0) {
    // left
    data[roomId].game.ball.v_x *= -1;
    data[roomId].game.p2.score += 1;
  }
  if (
    data[roomId].game.ball.y + data[roomId].game.ball.v_y >
    data[roomId].game.H - data[roomId].game.UD_d - 20
  ) {
    // down
    data[roomId].game.ball.v_y *= -1;
  } else if (
    data[roomId].game.ball.y + data[roomId].game.ball.v_y <
    data[roomId].game.UD_d
  ) {
    // up
    data[roomId].game.ball.v_y *= -1;
  }
}

function check_bar(roomId: string) {
  if (
    data[roomId].game.ball.x + data[roomId].game.ball.v_x >
      data[roomId].game.bar_d &&
    data[roomId].game.ball.x + data[roomId].game.ball.v_x <
      data[roomId].game.bar_d + 20 &&
    Math.abs(
      data[roomId].game.ball.y +
        data[roomId].game.ball.v_y -
        data[roomId].game.p1.mouse_y,
    ) < 40
  ) {
    data[roomId].game.ball.v_x = Math.abs(data[roomId].game.ball.v_x);
  } else if (
    data[roomId].game.ball.x + data[roomId].game.ball.v_x <
      data[roomId].game.W - data[roomId].game.bar_d - 20 &&
    data[roomId].game.ball.x + data[roomId].game.ball.v_x >
      data[roomId].game.W - data[roomId].game.bar_d - 40 &&
    Math.abs(
      data[roomId].game.ball.y +
        data[roomId].game.ball.v_y -
        data[roomId].game.p2.mouse_y,
    ) < 40
  ) {
    if (data[roomId].game.ball.v_x > 0) data[roomId].game.ball.v_x *= -1;
  }
}
