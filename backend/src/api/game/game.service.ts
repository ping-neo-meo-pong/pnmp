import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRoomDto } from '../../core/game/dto/game-room.dto';
import { GameRoomRepository } from '../../core/game/game-room.repository';
import { GameHistoryRepository } from '../../core/game/game-history.repository';
import { CreateGameRoomDto } from 'src/api/game/dto/create-game-room.dto';
import { IsNull } from 'typeorm';
import { DmRoom } from 'src/core/dm/dm-room.entity';
import { UserRepository } from 'src/core/user/user.repository';
import { SocketRepository } from 'src/core/socket/socket.repository';
import { GameMode } from 'src/enum/game-mode.enum';

@Injectable()
export class GameService {
  constructor(
    private gameRoomRepository: GameRoomRepository,
    @InjectRepository(GameHistoryRepository)
    private gameHistoryRepository: GameHistoryRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private socketRepository: SocketRepository,
  ) {}

  //   createGame() {}

  async getGames(): Promise<GameRoomDto[]> {
    const gameRooms = await this.gameRoomRepository.findAll();
    const ttt = [];
    for (const room of gameRooms) {
      ttt.push(room.gameRoomDto);
    }
    return ttt;
  }

  // async createGameRoom(
  //   userId: string,
  //   invitedUserId: string,
  // ): Promise<any> {
  //   const invitedUser = await this.userRepository.findOneBy({
  //     id: invitedUserId,
  //   });
  //   if (!invitedUser)
  //     throw new BadRequestException('invited user does not exist');

  //   const userIn = await this.gameRoomRepository.findByUserId(userId);
  //   if (userIn == null)
  //     return ;
  //   const userIn2 = await this.gameRoomRepository.findByUserId(invitedUserId);
  //   if (userIn2)
  //     return ;
  //   console.log(`invitedUser:`);
  //   console.log(invitedUser.id);
  //   const gameRoom = await this.gameRoomRepository.findOne();

  //   if (gameRoom) {
  //     throw new BadRequestException('Game room already exists');
  //   } else {
  //     await this.gameRoomRepository.save({
  //       leftUserId: leftUserId,
  //       rightUserId: invitedUser.id,
  //     } as any);
  //     const createdGameRoom = await this.gameRoomRepository.findOneBy({
  //       leftUserId: { id: leftUserId },
  //       rightUserId: { id: invitedUser.id },
  //     });
  //     console.log(`leftUserId:`);
  //     console.log(createdGameRoom);
  //     this.socketRepository.find(leftUserId)?.join(createdGameRoom.id);
  //     this.socketRepository.find(invitedUser.id)?.join(createdGameRoom.id);
  //     return {
  //       id: createdGameRoom.id,
  //       otherUser:
  //         createdGameRoom.leftUserId.id === leftUserId
  //           ? createdGameRoom.rightUserId.username
  //           : createdGameRoom.leftUserId.username,
  //     };
  //   }
  // }

  async createGameRoom(userId: string, invitedUserId: string) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    const invitedUser = await this.userRepository.findOneBy({
      id: invitedUserId,
    });
    return (await this.gameRoomRepository.createGameRoom(user, invitedUser, GameMode.NORMAL)).gameRoomDto;
  }
}
