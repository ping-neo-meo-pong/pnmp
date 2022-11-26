import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRoom } from '../../core/game/game-room.entity';
import { GameRoomRepository } from '../../core/game/game-room.repository';
import { GameHistoryRepository } from '../../core/game/game-history.repository';
import { CreateGameRoomDto } from 'src/api/game/dto/create-game-room.dto';
import { IsNull } from 'typeorm';
import { DmRoom } from 'src/core/dm/dm-room.entity';
import { UserRepository } from 'src/core/user/user.repository';
import { SocketRepository } from 'src/core/socket/socket.repository';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameRoomRepository)
    private gameRoomRepository: GameRoomRepository,
    @InjectRepository(GameHistoryRepository)
    private gameHistoryRepository: GameHistoryRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private socketRepository: SocketRepository,
  ) {}

  //   createGame() {}

  async getGames(userToken): Promise<GameRoom[]> {
    const gameRooms = await this.gameRoomRepository.getGameRooms(userToken);
    const result = [];
    for (const gameRoom of gameRooms) {
      result.push({
        id: gameRoom.id,
        otherUser:
          gameRoom.leftUserId.id === userToken.id
          ? gameRoom.rightUserId.username
          : gameRoom.leftUserId.username,
      });
    }
    return result;
  }

  async createGameRoom(leftUserId: string, rightUserIdName: string): Promise<any> {
    const invitedUser = await this.userRepository.findOneBy({
      username: rightUserIdName
    });
    if (!invitedUser)
    throw new BadRequestException('invited user does not exist');
    if (leftUserId === invitedUser.id) {
      throw new BadRequestException('cannot create Game room with yourself');
    }
    console.log(`invitedUser:`);
    console.log(invitedUser.id);
    const gameRoom = await this.gameRoomRepository.findOne({
      relations: ['leftUserId', 'rightUserId'],
      where: [
        {
          leftUserId: { id: leftUserId },
          rightUserId: { id: invitedUser.id },
        },
        {
          leftUserId: { id: invitedUser.id },
          rightUserId: { id: leftUserId },
        },
      ],
    });

    if (gameRoom) {
      throw new BadRequestException('Game room already exists');
    } else {
      await this.gameRoomRepository.save({
        leftUserId: leftUserId,
        rightUserId: invitedUser.id,
      } as any);
      const createdGameRoom = await this.gameRoomRepository.findOneBy({
        leftUserId: { id: leftUserId },
        rightUserId: { id: invitedUser.id },
      }); ////////////////// help /////////////////////
      console.log(`leftUserId:`);
      console.log(createdGameRoom);
      this.socketRepository.find(leftUserId)?.join(createdGameRoom.id);
      this.socketRepository.find(invitedUser.id)?.join(createdGameRoom.id);
      return {
        id: createdGameRoom.id,
        otherUser: createdGameRoom.leftUserId.id === leftUserId ?
          createdGameRoom.rightUserId.username :
          createdGameRoom.leftUserId.username,
      };
    }
  }
}
