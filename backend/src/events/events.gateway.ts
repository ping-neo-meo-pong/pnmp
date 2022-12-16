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
import { Game, GameRoomDto } from '../core/game/dto/game-room.dto';
import { GameQue } from '../core/game/dto/game-queue.dto';
import { GameQueueRepository } from '../core/game/game-queue.repository';
import { UserRepository } from '../core/user/user.repository';
import { GameMode } from 'src/enum/game-mode.enum';
import { GameHistoryRepository } from 'src/core/game/game-history.repository';
import { History } from 'src/core/game/dto/game-history.dto';
import { GameRoom } from 'src/core/game/game-room.entity';
import { Side, WinLose } from '../enum/win-lose.enum';
import { UserStatus } from 'src/enum/user-status';

function wsGuard(socket: UserSocket) {
  if (!socket.hasOwnProperty('user')) {
    // socket.disconnect();
    throw new WsException('Not authorized');
  }
}

@WebSocketGateway({ transports: ['websocket'] })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  friendQue: any[] = [];
  endScore = 5;

  constructor(
    private socketRepository: SocketRepository,
    private jwtService: JwtService,
    private dmRoomRepository: DmRoomRepository,
    private dmRepository: DmRepository,
    private gameRoomRepository: GameRoomRepository,
    private gameQueueRepository: GameQueueRepository,
    private userRepository: UserRepository,
    private gameHistroyRepository: GameHistoryRepository,
  ) {}

  async handleConnection(socket: Socket) {
    console.log('connected');
  }

  async handleDisconnect(socket: UserSocket) {
    console.log('disconnected');
    if (socket.hasOwnProperty('user')) {
      const user = await this.userRepository.findOneBy({ id: socket.user.id });
      if (user && user.status != UserStatus.INGAME) {
        await this.userRepository.update(socket.user.id, {
          status: UserStatus.OFFLINE,
        });
      }
      this.socketRepository.delete(socket.user.id);
    }
  }

  @SubscribeMessage('authorize')
  async authorize(
    @ConnectedSocket() socket: UserSocket,
    @MessageBody() jwt: string,
  ) {
    console.log('authorize()');
    try {
      console.log(jwt);
      socket.user = this.jwtService.verify(jwt);
      this.socketRepository.save(socket.user.id, socket);
      if (
        (await this.userRepository.findOneBy({ id: socket.user.id })).status !=
        UserStatus.INGAME
      ) {
        await this.userRepository.update(socket.user.id, {
          status: UserStatus.ONLINE,
        });
      }
    } catch (err) {
      socket.disconnect();
      console.log('disconnect in authorize()');
    }
  }

  //   @SubscribeMessage('dmMessage')
  //   onDmMessage(@ConnectedSocket() socket: UserSocket, @MessageBody() data: any) {
  //     wsGuard(socket);
  //     this.dmRepository.save({
  //       message: data.msg,
  //       dmRoomId: data.roomId,
  //       sendUserId: socket.user.id,
  //     });
  //     this.server.in(data.roomId).emit(`dmMsgEvent_${data.roomId}`, data.msg);
  //   }

  /////////////    game    //////////////

  @SubscribeMessage('gameToFriend')
  async makeGameRoom(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() data: any,
  ) {
    if (this.gameQueueRepository.findIdxByUserId(client.user.id) >= 0) {
      console.log(`you are already joined at Que`);
      return;
    }
    const invitedUser = await this.userRepository.findOneBy({
      username: data.invitedUserName,
    });
    if (this.gameQueueRepository.findIdxByUserId(invitedUser.id) >= 0) {
      console.log(`friend is already joined at Que`);
      return;
    }
    if (await this.gameRoomRepository.findByUserId(client.user.id)) {
      console.log(`you're already in the game`);
      return;
    } else if (await this.gameRoomRepository.findByUserId(invitedUser.id)) {
      console.log(`friend is already in the game`);
      return;
    }
    const invitedSocket = this.socketRepository.find(invitedUser.id);
    if (invitedSocket) {
      this.server.sockets
        .to(invitedSocket.id)
        .emit(`gameInvited`, client.user.id);
    } else {
      console.log(`friend not login`);
    }

    for (const que of this.friendQue) {
      if (que.leftUserId == client.user.id) {
        // inviter 만 찾는다
        console.log(`you already joined fiend Que`);
        return;
      }
    }
    const leftUserId = client.user.id;
    const rightUserId = invitedUser.id;

    this.friendQue.push({
      leftUserId: leftUserId,
      rightUserId: rightUserId,
      mode: data.mode,
    });
    console.log(this.friendQue);
  }
  @SubscribeMessage('acceptFriendQue')
  async acceptFriendQue(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() inviter: string,
  ) {
    // for (let que of this.friendQue) {
    const findIndex = this.friendQue.findIndex((E) => E.leftUserId == inviter);
    if (findIndex >= 0) {
      // if (que.leftUserId == inviter) { // inviter 만 찾는다
      if (this.friendQue[findIndex].rightUserId == client.user.id) {
        // matching!
        const leftUser = await this.userRepository.findOneBy({ id: inviter });
        const rightUser = await this.userRepository.findOneBy({
          id: client.user.id,
        });
        const room = await this.gameRoomRepository.createGame(
          leftUser,
          rightUser,
          this.friendQue[findIndex].mode,
        );
        client.join(room.gameRoomDto.id);
        if (room.gameRoomDto.leftUser.id == client.user.id) {
          console.log('leftUser emit!');
          console.log(room.gameRoomDto.rightUser.id);
          this.socketRepository
            .find(room.gameRoomDto.rightUser.id)
            .join(room.gameRoomDto.id);
        } else {
          console.log('rightUser');
          console.log(room.gameRoomDto.leftUser.id);
          this.socketRepository
            .find(room.gameRoomDto.leftUser.id)
            .join(room.gameRoomDto.id);
        }
        this.server
          .in(room.gameRoomDto.id)
          .emit('goToGameRoom', room.gameRoomDto.id);
      } else {
        console.log(`you are not invited`);
      }
      // }
      this.friendQue.splice(findIndex, 1);
    } else {
      console.log(`inviter out the que`);
    }
  }
  @SubscribeMessage('cencelFriendQue')
  async cencelFriendQue(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() inviter: string,
  ) {
    const findIndex = this.friendQue.findIndex(
      (leftUserId) => leftUserId == inviter,
    ); // inviter 만 찾는다
    if (findIndex >= 0) {
      this.friendQue.splice(findIndex, 1);
      return;
    }
    console.log(`there is no Friend Que`);
  }

  @SubscribeMessage('comeInGameRoom')
  async comeCome(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() roomId: string,
  ) {
    console.log('comeInGameRoom()');
    console.log(roomId);
    wsGuard(client);

    const room = await this.gameRoomRepository.findById(roomId);
    if (!room) {
      console.log('No Room');
      return;
    }
    client.join(roomId);
    console.log(`client ${client.user.id} joined in ${roomId}`);
    await this.userRepository.update(room.gameRoomDto.leftUser.id, {
      status: UserStatus.INGAME,
    });
    await this.userRepository.update(room.gameRoomDto.rightUser.id, {
      status: UserStatus.INGAME,
    });

    //   if user == L ? R
    if (room.gameRoomDto.leftUser.id == client.user.id) {
      clearInterval(room.gameLoop);
      clearInterval(room.startTimer);
      clearInterval(room.p1EndTimer);
      room.gameRoomDto.gameData.p1.in = true;
    } else if (room.gameRoomDto.rightUser.id == client.user.id) {
      clearInterval(room.gameLoop);
      clearInterval(room.startTimer);
      clearInterval(room.p2EndTimer);
      room.gameRoomDto.gameData.p2.in = true;
    } else {
      console.log(`im viewer`);
      client.emit(`game[${roomId}]`, room.gameRoomDto);
      return;
    }

    // if user L & R
    if (room.gameRoomDto.gameData.p1.in && room.gameRoomDto.gameData.p2.in) {
      let count = 3;
      this.server.in(roomId).emit(`game[${roomId}]`, room.gameRoomDto);
      room.startTimer = setInterval(() => {
        if (count === 0) {
          clearInterval(room.startTimer);
          clearInterval(room.gameLoop);
          room.gameLoop = setInterval(async () => {
            this.server.in(roomId).emit(`game[${roomId}]`, room.gameRoomDto);
            if (ball_engine(room.gameRoomDto, this.endScore) == false) {
              this.closeGame(roomId, room);
            }
          }, 1000 / 30);
        } else {
          this.server.in(roomId).emit('countDown', count);
          count--;
        }
      }, 1000);
    }
  }

  @SubscribeMessage('giveMeInvited')
  async giveMeInvited(@ConnectedSocket() client: UserSocket) {
    wsGuard(client);
    const gameQueList: any[] = [];
    for (const que of this.friendQue) {
      if (que.rightUserId == client.user.id) {
        const user = await this.userRepository.findOneBy({
          id: que.leftUserId,
        });
        if (user == null) {
          console.log(`can not find user`);
          return;
        }
        gameQueList.push({ inviterName: user.username, inviterId: user.id });
      }
    }
    if (gameQueList.length) {
      client.emit(`invitedQue`, gameQueList);
    } else {
      console.log(`GameInvitedQ: no invited Que`);
    }
  }

  @SubscribeMessage('racket')
  async bar(@ConnectedSocket() client: UserSocket, @MessageBody() _data) {
    wsGuard(client);
    const room = await this.gameRoomRepository.findById(_data.roomId);
    if (!room) return;
    //   if user == L ? R
    if (room.gameRoomDto.leftUser.id == client.user.id) {
      room.gameRoomDto.gameData.p1.mouse_y = _data.m_y;
    } else if (room.gameRoomDto.rightUser.id == client.user.id) {
      room.gameRoomDto.gameData.p2.mouse_y = _data.m_y;
    } else {
      // client.disconnect(); // attacker
    }
  }

  @SubscribeMessage('roomOut')
  async roomOut(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() roomId: string,
  ) {
    wsGuard(client);
    const room = await this.gameRoomRepository.findById(roomId);
    if (!room) return;

    console.log('gameOut');
    console.log(client.user.id);
    const joinedClients = this.server.sockets.adapter.rooms.get(roomId);
    if (joinedClients && joinedClients.has(client.id)) {
      console.log(`leave ${client.user.id} in ${roomId}`);
      client.leave(roomId);
    } else {
      return;
    }

    //   if user == L ? R
    if (room.gameRoomDto.leftUser.id == client.user.id) {
      room.gameRoomDto.gameData.p1.in = false;
      clearInterval(room.startTimer);
      clearInterval(room.gameLoop);
      let countDown = 60;
      room.p1EndTimer = setInterval(() => {
        if (countDown < 0) {
          clearInterval(room.p1EndTimer);
          clearInterval(room.p2EndTimer);
          room.gameRoomDto.gameData.p1.score = -1;
          this.closeGame(roomId, room);
        } else {
          console.log('countDown');
          this.server.in(roomId).emit('countDown1', countDown);
          countDown--;
        }
      }, 1000);
    } else if (room.gameRoomDto.rightUser.id == client.user.id) {
      room.gameRoomDto.gameData.p2.in = false;
      clearInterval(room.startTimer);
      clearInterval(room.gameLoop);
      let countDown = 60;
      room.p2EndTimer = setInterval(() => {
        if (countDown < 0) {
          clearInterval(room.p1EndTimer);
          clearInterval(room.p2EndTimer);
          room.gameRoomDto.gameData.p2.score = -1;
          this.closeGame(roomId, room);
        } else {
          console.log('countDown');
          this.server.in(roomId).emit('countDown2', countDown);
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
    console.log(`client.user`);
    console.log(client.user);
    if (!client.user) {
      client.disconnect();
      return;
    }
    const is_join = await this.gameRoomRepository.findByUserId(client.user.id);
    if (is_join) {
      console.log(`already you game`);
      return;
    }
    const user = await this.userRepository.findOneBy({ id: client.user.id });
    if (user) {
      this.gameQueueRepository.addQue(client.user.id, user.ladder, mode);
      const wait = 0;
      await this.func(10000, client, wait);
    }
  }
  async func(time, client, wait) {
    if ((await this.matching(client, wait)) == false) {
      const idx = this.gameQueueRepository.findIdxByUserId(client.user.id);
      clearTimeout(this.gameQueueRepository.getQueLoop(idx));
      this.gameQueueRepository.setQueLoop(
        idx,
        setTimeout(() => {
          this.func(time + 10000, client, wait + 1);
        }, time),
      );
    }
  }

  async matching(client, wait): Promise<boolean> {
    const idx = this.gameQueueRepository.findIdxByUserId(client.user.id);
    if (idx < 0) {
      return; // TypeError: Cannot set properties of undefined (setting 'wait') :288
    }
    const room = await this.gameQueueRepository.checkQue(client.user.id, wait);
    console.log('events find room');
    console.log(room);
    if (room) {
      clearTimeout(this.gameQueueRepository.getQueLoop(idx));
      console.log('really find Que!!');
      console.log(client.user.id);
      console.log(room);
      client.join(room.gameRoomDto.id);
      console.log(`really ${room.gameRoomDto.leftUser.id}`);
      if (room.gameRoomDto.leftUser.id == client.user.id) {
        console.log('rightUser emit!');
        console.log(room.gameRoomDto.rightUser.id);
        this.socketRepository
          .find(room.gameRoomDto.rightUser.id)
          .join(room.gameRoomDto.id);
      } else {
        console.log('leftUser');
        console.log(room.gameRoomDto.leftUser.id);
        this.socketRepository
          .find(room.gameRoomDto.leftUser.id)
          .join(room.gameRoomDto.id);
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

  async closeGame(roomId: string, room: Game) {
    this.server.in(roomId).emit(`game[${roomId}]`, room.gameRoomDto);
    console.log('game OVER!!!');
    clearInterval(room.gameLoop);
    // game history
    // erase gameRoom
    this.gameRoomRepository.eraseGameRoom(roomId);
    setTimeout(() => {
      this.server.in(roomId).emit(`getOut!`);
      this.server.socketsLeave(roomId);
    }, 3000);
    await this.saveHistory(room.gameRoomDto, this.endScore);
  }

  async saveHistory(room: GameRoomDto, endScore: number) {
    let leftWin, rightWin;
    let leftLadder = room.leftUser.ladder;
    let rightLadder = room.rightUser.ladder;
    if (room.gameData.p1.score == endScore) {
      leftWin = 'WIN';
      leftLadder = room.leftUser.ladder + 1;
      rightWin = 'LOSE';
      if (rightLadder > 0) rightLadder = room.rightUser.ladder - 1;
    } else {
      leftWin = 'LOSE';
      if (leftLadder > 0) leftLadder = room.leftUser.ladder - 1;
      rightWin = 'WIN';
      rightLadder = room.rightUser.ladder + 1;
    }
    const leftHistory: History = {
      win: leftWin,
      side: Side.LEFT,
      score: room.gameData.p1.score,
      ladder: room.leftUser.ladder,
      userId: room.leftUser.id,
      gameRoomId: room.id,
    };
    const rightHistory: History = {
      win: rightWin,
      side: Side.RIGHT,
      score: room.gameData.p2.score,
      ladder: room.rightUser.ladder,
      userId: room.rightUser.id,
      gameRoomId: room.id,
    };
    await this.gameHistroyRepository.createHistory(leftHistory);
    await this.gameHistroyRepository.createHistory(rightHistory);
    await this.userRepository.update(room.leftUser.id, {
      status: UserStatus.OFFLINE,
      ladder: leftLadder,
    });
    await this.userRepository.update(room.rightUser.id, {
      status: UserStatus.OFFLINE,
      ladder: rightLadder,
    });
  }

  // sendToDB(roomId: string) {
  //   this.gameHistroyRepository.save()
  // }

  @SubscribeMessage('cencelMatching')
  async cencelMatcing(@ConnectedSocket() client: UserSocket) {
    if (this.gameQueueRepository.cencelQue(client.user.id) == false) {
      console.log(`cencel Error`);
    }

    const findIndex = this.friendQue.findIndex(
      (E) => E.leftUserId == client.user.id,
    );
    if (findIndex >= 0) {
      // inviter 만 찾는다
      this.friendQue.splice(findIndex, 1);
      console.log(this.friendQue);
      return;
    }
    console.log(`there is no Friend Que`);
  }
}

function ball_engine(dto: GameRoomDto, endScore: number): boolean {
  if (check_wall(dto, endScore) < 0) return false;
  check_bar(dto);

  dto.gameData.ball.x += dto.gameData.ball.v_x;
  dto.gameData.ball.y += dto.gameData.ball.v_y;
  return true;
}

function check_wall(dto: GameRoomDto, endScore: number): number {
  if (dto.gameData.ball.x + dto.gameData.ball.v_x > dto.gameData.W - 20) {
    // right
    dto.gameData.ball.x = dto.gameData.W / 2;
    dto.gameData.ball.y = dto.gameData.H / 2;
    dto.gameData.p1.score += 1;
    if (dto.gameData.p1.score == endScore) {
      return -1;
    }
    if (dto.gameMode == GameMode.HARD) {
      const temp = dto.gameData.ball.v_x * -1;
      dto.gameData.ball.v_x = 0;
      setTimeout(() => {
        dto.gameData.ball.v_x = temp;
      }, 1000);
    } else {
      dto.gameData.ball.v_x *= -1;
    }
  } else if (dto.gameData.ball.x + dto.gameData.ball.v_x < 0) {
    // left
    dto.gameData.ball.x = dto.gameData.W / 2;
    dto.gameData.ball.y = dto.gameData.H / 2;
    dto.gameData.p2.score += 1;
    if (dto.gameData.p2.score == endScore) {
      return -1;
    }
    if (dto.gameMode == GameMode.HARD) {
      const temp = dto.gameData.ball.v_x * -1;
      dto.gameData.ball.v_x = 0;
      setTimeout(() => {
        dto.gameData.ball.v_x = temp;
      }, 1000);
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
  } else if (dto.gameData.ball.y + dto.gameData.ball.v_y < dto.gameData.UD_d) {
    // up
    dto.gameData.ball.v_y *= -1;
  }
  return 1;
}

function check_bar(dto: GameRoomDto) {
  if (
    // check left bar
    dto.gameData.ball.x + dto.gameData.ball.v_x > dto.gameData.bar_d &&
    dto.gameData.ball.x + dto.gameData.ball.v_x < dto.gameData.bar_d + 20 &&
    Math.abs(
      dto.gameData.ball.y + dto.gameData.ball.v_y - dto.gameData.p1.mouse_y,
    ) < 40
  ) {
    plus_speed(dto.gameData);
    if (dto.gameData.ball.v_x < 0) dto.gameData.ball.v_x *= -1;
  } else if (
    dto.gameData.ball.x + dto.gameData.ball.v_x >
      dto.gameData.W - (dto.gameData.bar_d + 40) &&
    dto.gameData.ball.x + dto.gameData.ball.v_x <
      dto.gameData.W - (dto.gameData.bar_d + 20) &&
    Math.abs(
      dto.gameData.ball.y + dto.gameData.ball.v_y - dto.gameData.p2.mouse_y,
    ) < 40
  ) {
    plus_speed(dto.gameData);
    if (dto.gameData.ball.v_x > 0) dto.gameData.ball.v_x *= -1;
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
