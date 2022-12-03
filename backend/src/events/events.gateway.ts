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
import { GameRoom, GameRoomDto } from '../core/game/dto/game-room.dto';
import { GameQue } from '../core/game/dto/game-queue.dto';
import { GameQueueRepository } from '../core/game/game-queue.repository'
import { UserRepository } from '../core/user/user.repository';
import { GameMode } from 'src/enum/game-mode.enum';

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
    if (!room) {
      console.log('No Room');
      return;
    }
    client.join(roomId);
    console.log(`client ${client.user.id} joined in ${roomId}`);

    //   if user == L ? R
    let viewer = 0;
    if (room.gameRoomDto.leftUser.id == client.user.id) {
      clearInterval(room.p1EndTimer);
      room.gameRoomDto.gameData.p1.in = true;
    } else if (room.gameRoomDto.rightUser.id == client.user.id) {
      clearInterval(room.p2EndTimer);
      room.gameRoomDto.gameData.p2.in = true;
    } else { viewer = 1; console.log(`im viewer`) }

    // if user L & R
    if (room.gameRoomDto.gameData.p1.in && room.gameRoomDto.gameData.p2.in) {
      let count = 3;
      room.startTimer = setInterval(() => {
        if (count === 0 || viewer == 1) {
          clearInterval(room.startTimer);
          clearInterval(room.gameLoop);
          room.gameLoop = setInterval(() => {
            this.server
              .in(roomId)
              .emit(`game[${roomId}]`, room.gameRoomDto.gameData);
            if (ball_engine(room.gameRoomDto) == false) {
              this.server
                .in(roomId)
                .emit(`game[${roomId}]`, room.gameRoomDto.gameData);
              console.log('game OVER!!!');
              clearInterval(room.gameLoop);
              // game history
              // erase gameRoom
              this.gameRoomRepository.eraseGameRoom(roomId);
              setTimeout(() => {
                this.server
                  .in(roomId)
                  .emit(`getOut!`);
                this.server.socketsLeave(roomId);
              }, 3000)
            }
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
    if (!room)
      return;
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

    console.log('gameOut');
    console.log(client.user.id);
    const joinedClients = this.server.sockets.adapter.rooms.get(roomId);
    if (joinedClients && joinedClients.has(client.id)) {
      console.log(`leave ${client.user.id} in ${roomId}`);
      client.leave(roomId);
    }
    else {
      return;
    }

    //   if user == L ? R
    if (room.gameRoomDto.leftUser.id == client.user.id) {
      room.gameRoomDto.gameData.p1.in = false;
      clearInterval(room.startTimer);
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

  @SubscribeMessage('gameMatching') ////////////// Matching ///////////////
  async gameQue(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() mode: GameMode,
  ) {
    // console.log(client.user.id);
    const is_join = await this.gameRoomRepository.findByUserId(client.user.id);
    if (is_join) {
      console.log(`already you game`);
      return ;
    }
    const user = await this.userRepository.findOneBy({ id: client.user.id });
    if (user) {
      // await this.userRepository.update(client.user.id, {
      //   ladder: user.ladder,
      // });
      this.gameQueueRepository.addQue(client.user.id, user.ladder, mode);
      let wait = 0;
      await this.func(10000, client, wait);
    }
  }
  async func(time, client, wait) {
    if (await this.matching(client, wait) == false) {
      let idx = this.gameQueueRepository.findIdxByUserId(client.user.id);
      clearTimeout(this.gameQueueRepository.getQueLoop(idx));
      this.gameQueueRepository.setQueLoop(idx, setTimeout(() => {
        this.func(time + 10000, client, wait + 1)
      }, time));
    }
  }

  async matching(client, wait): Promise<boolean> {
    let idx = this.gameQueueRepository.findIdxByUserId(client.user.id);
    let room = await this.gameQueueRepository.checkQue(client.user.id, wait);
    console.log('events find room');
    console.log(room);
    if (room) {
      clearTimeout(this.gameQueueRepository.getQueLoop(idx));
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
      console.log(`setWait idx: ${idx}`);
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


function ball_engine(dto: GameRoomDto): boolean {
  if (check_wall(dto) < 0)
    return false;
  check_bar(dto);

  dto.gameData.ball.x += dto.gameData.ball.v_x;
  dto.gameData.ball.y += dto.gameData.ball.v_y;
  return true;
}

function check_wall(dto: GameRoomDto): number {
  if (
    dto.gameData.ball.x + dto.gameData.ball.v_x >
    dto.gameData.W - 20
  ) {
    // right
    dto.gameData.ball.x = dto.gameData.W / 2;
    dto.gameData.ball.y = dto.gameData.H / 2;
    dto.gameData.p1.score += 1;
    if (dto.gameData.p1.score == 5) {
      return -1;
    }
    if (dto.gameMode == GameMode.HARD) {
      let temp = dto.gameData.ball.v_x * -1;
      dto.gameData.ball.v_x = 0;
      setTimeout(() => {
        dto.gameData.ball.v_x = temp;
      }, 1000)
    } else {
      dto.gameData.ball.v_x *= -1;
    }
  } else if (dto.gameData.ball.x + dto.gameData.ball.v_x < 0) {
    // left
    dto.gameData.ball.x = dto.gameData.W / 2;
    dto.gameData.ball.y = dto.gameData.H / 2;
    dto.gameData.p2.score += 1;
    if (dto.gameData.p2.score == 5) {
      return -1;
    }
    if (dto.gameMode == GameMode.HARD) {
      let temp = dto.gameData.ball.v_x * -1;
      dto.gameData.ball.v_x = 0;
      setTimeout(() => {
        dto.gameData.ball.v_x = temp;
      }, 1000)
    } else {
      dto.gameData.ball.v_x *= -1;
    }
  }
  if (
    dto.gameData.ball.y + dto.gameData.ball.v_y >
    dto.gameData.H - dto.gameData.UD_d - 20
  ) {
    // down
    dto.gameData.ball.v_y *= -1;
  } else if (
    dto.gameData.ball.y + dto.gameData.ball.v_y <
    dto.gameData.UD_d
  ) {
    // up
    dto.gameData.ball.v_y *= -1;
  }
  return 1;
}

function check_bar(dto: GameRoomDto) {
  if ( // check left bar
    dto.gameData.ball.x + dto.gameData.ball.v_x >
    dto.gameData.bar_d &&
    dto.gameData.ball.x + dto.gameData.ball.v_x <
    dto.gameData.bar_d + 20 &&
    Math.abs(
      dto.gameData.ball.y +
      dto.gameData.ball.v_y -
      dto.gameData.p1.mouse_y,
    ) < 40
  ) {
    plus_speed(dto.gameData);
    if (dto.gameData.ball.v_x < 0)
      dto.gameData.ball.v_x *= -1;
  } else if (
    dto.gameData.ball.x + dto.gameData.ball.v_x >
    dto.gameData.W - (dto.gameData.bar_d + 40) &&
    dto.gameData.ball.x + dto.gameData.ball.v_x <
    dto.gameData.W - (dto.gameData.bar_d + 20) &&
    Math.abs(
      dto.gameData.ball.y +
      dto.gameData.ball.v_y -
      dto.gameData.p2.mouse_y,
    ) < 40
  ) {
    plus_speed(dto.gameData);
    if (dto.gameData.ball.v_x > 0)
      dto.gameData.ball.v_x *= -1;
  }
}

function plus_speed(gameData: any) {
  if (Math.abs(gameData.ball.v_x) + gameData.ball.plus_speed < 15)
    gameData.ball.v_x = Math.abs(gameData.ball.v_x) + gameData.ball.plus_speed;
  if (Math.abs(gameData.ball.v_y) + gameData.ball.plus_speed < 17) {
    if (gameData.ball.v_y < 0)
      gameData.ball.v_y = gameData.ball.v_y - gameData.ball.plus_speed;
    else if (gameData.ball.v_y > 0)
      gameData.ball.v_y = gameData.ball.v_y + gameData.ball.plus_speed;
  }
}