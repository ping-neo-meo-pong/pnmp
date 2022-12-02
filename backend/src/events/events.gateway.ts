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
import { Injectable, UseGuards } from '@nestjs/common';
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
import { on } from 'events';
import { clear } from 'console';
import { GameRoom } from '../core/game/dto/game-room.dto';
import { GameQue } from '../core/game/dto/game-queue.dto';
import { GameQueueRepository } from '../core/game/game-queue.repository'
import { UserRepository } from '../core/user/user.repository';

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
    private gameQueueRepository: GameQueueRepository,
    private userRepository: UserRepository,
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

  /////////////    game    //////////////

  @SubscribeMessage('comeInGameRoom')
  async comeCome(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() roomId: string,
  ) {
    wsGuard(client);

    const room = await this.gameRoomRepository.findById(+roomId);
    if (!room)
      return;
    client.join(roomId);
    //   if user == L ? R
    if (room.gameRoomDto.leftUser.id == client.user.id) {
      clearInterval(room.p1EndTimer);
      room.gameRoomDto.gameData.p1.in = true;
    } else if (room.gameRoomDto.rightUser.id == client.user.id) {
      clearInterval(room.p2EndTimer);
      room.gameRoomDto.gameData.p2.in = true;
    } else { /* 관전자 */ }

    // if user L & R
    if (room.gameRoomDto.gameData.p1.in && room.gameRoomDto.gameData.p2.in) {
      let count = 3;
      room.startTimer = setInterval(() => {
        if (count === 0) {
          clearInterval(room.startTimer);
          room.gameLoop = setInterval(() => {
            this.server
              .in(roomId)
              .emit(`game[${roomId}]`, room.gameRoomDto.gameData);
            ball_engine(room);
          }, 1000 / 30);
        } else {
          this.server
            .in(roomId)
            .emit('countDown', count);
          count--;
        }
      }, 1000);
    }
  }

  @SubscribeMessage('racket')
  async bar(@ConnectedSocket() client: UserSocket, @MessageBody() _data) {
    wsGuard(client);
    const room = await this.gameRoomRepository.findById(_data.roomId);

    //   if user == L ? R
    if (room.gameRoomDto.leftUser.id == client.user.id) {
      room.gameRoomDto.gameData.p1.mouse_y = _data.m_y;
    } else if (room.gameRoomDto.rightUser.id == client.user.id) {
      room.gameRoomDto.gameData.p2.mouse_y = _data.m_y;
    } else {
      client.disconnect(); // attacker
    }
  }

  @SubscribeMessage('gameOut')
  async gameOut(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() roomId: string,
  ) {
    wsGuard(client);
    const room = await this.gameRoomRepository.findById(+roomId);
    if (!room)
      return;

    console.log(client.user.id);
    const joinedClients = this.server.sockets.adapter.rooms.get(roomId);
    if (joinedClients.has(client.id))
      client.leave(roomId);

    //   if user == L ? R
    if (room.gameRoomDto.leftUser.id == client.user.id) {
      room.gameRoomDto.gameData.p1.in = false;
      clearInterval(room.gameLoop);
      let countDown = 60;
      room.p1EndTimer = setInterval(() => {
        if (countDown < 0)
          clearInterval(room.p1EndTimer);
        else {
          console.log('countDown');
          this.server
            .in(roomId)
            .emit('countDown1', countDown);
          countDown--;
        }
      }, 1000);
    } else if (room.gameRoomDto.rightUser.id == client.user.id) {
      room.gameRoomDto.gameData.p2.in = false;
      clearInterval(room.gameLoop);
      let countDown = 60;
      room.p2EndTimer = setInterval(() => {
        if (countDown < 0)
          clearInterval(room.p2EndTimer);
        else {
          console.log('countDown');
          this.server
            .in(roomId)
            .emit('countDown2', countDown);
          countDown--;
        }
      }, 1000);
    }
    console.log(`game out`);
  }

  @SubscribeMessage('gameMatching')
  async gameQue(
    @ConnectedSocket() client: UserSocket,
  ) {
    console.log(client.user.id);
    const user = await this.userRepository.findOneBy({ id: client.user.id });
    if (user) {
      // await this.userRepository.update(client.user.id, {
      //   ladder: user.ladder,
      // });
      this.gameQueueRepository.addQue(client.user.id, user.ladder);
      let idx = this.gameQueueRepository.nextIdx();
      let wait = 0;
      await this.func(10000, client, idx, wait);
    }
  }
  async func(time, client, idx, wait) {
    if (await this.matching(client, idx, wait) == false) {
      this.gameQueueRepository.setQueLoop(idx, setTimeout(() => {
        this.func(time + 10000, client, idx, wait + 1)
      }, time));
    }
  }
  
  async matching(client, idx, wait): Promise<boolean> {
    let room = await this.gameQueueRepository.checkQue(client.user.id, wait);
    console.log('events find room');
    console.log(room);
    if (room) {
      // clearInterval(this.gameQueueRepository.getQueLoop(idx));
      console.log('really find Que!!');
      console.log(client.user.id);
      console.log(room);
      client.join(room.gameRoomDto.id);
      if (room.gameRoomDto.leftUser.id == client.user.id) {
        console.log('rightUser emit!');
        console.log(room.gameRoomDto.rightUser.id);
        this.socketRepository.find(room.gameRoomDto.rightUser.id).join(room.gameRoomDto.id);
      } else {
        console.log('leftUser');
        console.log(room.gameRoomDto.leftUser.id);
        this.socketRepository.find(room.gameRoomDto.leftUser.id).join(room.gameRoomDto.id);
      }
      this.server
      .in(room.gameRoomDto.id)
      .emit('goToGameRoom', room.gameRoomDto.id);
      return true;
    } else {
      this.gameQueueRepository.setWait(idx, wait);
      return false;
    }
  }
  @SubscribeMessage('cencelMatching')
  async cencelMatcing(
    @ConnectedSocket() client: UserSocket,
  ) {
    if (this.gameQueueRepository.cencelQue(client.user.id) == false)
      console.log(`cencel Error`);
  }
}


function ball_engine(room: GameRoom) {
  check_wall(room);
  check_bar(room);

  room.gameRoomDto.gameData.ball.x += room.gameRoomDto.gameData.ball.v_x;
  room.gameRoomDto.gameData.ball.y += room.gameRoomDto.gameData.ball.v_y;
}

function check_wall(room: GameRoom) {
  if (
    room.gameRoomDto.gameData.ball.x + room.gameRoomDto.gameData.ball.v_x >
    room.gameRoomDto.gameData.W - 20
  ) {
    // right
    room.gameRoomDto.gameData.ball.v_x *= -1;
    room.gameRoomDto.gameData.p1.score += 1;
  } else if (room.gameRoomDto.gameData.ball.x + room.gameRoomDto.gameData.ball.v_x < 0) {
    // left
    room.gameRoomDto.gameData.ball.v_x *= -1;
    room.gameRoomDto.gameData.p2.score += 1;
  }
  if (
    room.gameRoomDto.gameData.ball.y + room.gameRoomDto.gameData.ball.v_y >
    room.gameRoomDto.gameData.H - room.gameRoomDto.gameData.UD_d - 20
  ) {
    // down
    room.gameRoomDto.gameData.ball.v_y *= -1;
  } else if (
    room.gameRoomDto.gameData.ball.y + room.gameRoomDto.gameData.ball.v_y <
    room.gameRoomDto.gameData.UD_d
  ) {
    // up
    room.gameRoomDto.gameData.ball.v_y *= -1;
  }
}

function check_bar(room: GameRoom) {
  if (
    room.gameRoomDto.gameData.ball.x + room.gameRoomDto.gameData.ball.v_x >
    room.gameRoomDto.gameData.bar_d &&
    room.gameRoomDto.gameData.ball.x + room.gameRoomDto.gameData.ball.v_x <
    room.gameRoomDto.gameData.bar_d + 20 &&
    Math.abs(
      room.gameRoomDto.gameData.ball.y +
      room.gameRoomDto.gameData.ball.v_y -
      room.gameRoomDto.gameData.p1.mouse_y,
    ) < 40
  ) {
    room.gameRoomDto.gameData.ball.v_x = Math.abs(room.gameRoomDto.gameData.ball.v_x);
  } else if (
    room.gameRoomDto.gameData.ball.x + room.gameRoomDto.gameData.ball.v_x <
    room.gameRoomDto.gameData.W - room.gameRoomDto.gameData.bar_d - 20 &&
    room.gameRoomDto.gameData.ball.x + room.gameRoomDto.gameData.ball.v_x >
    room.gameRoomDto.gameData.W - room.gameRoomDto.gameData.bar_d - 40 &&
    Math.abs(
      room.gameRoomDto.gameData.ball.y +
      room.gameRoomDto.gameData.ball.v_y -
      room.gameRoomDto.gameData.p2.mouse_y,
    ) < 40
  ) {
    if (room.gameRoomDto.gameData.ball.v_x > 0) room.gameRoomDto.gameData.ball.v_x *= -1;
  }
}
