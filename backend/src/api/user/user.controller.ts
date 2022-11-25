import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../core/user/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { isUUID } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { DuplicateUserDto } from './dto/duplicate-user.dto';
import { Friend } from '../../core/friend/friend.entity';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '전체유저 조회' })
  findUsers(): Promise<User[]> {
    return this.userService.findUsers();
  }

  @Get('search')
  @ApiOperation({
    summary:
      'username으로 유저를 검색, query에 username이 없으면 전체 유저를 반환',
  })
  searchUsers(@Query() searchUserData: SearchUserDto): Promise<User[]> {
    return this.userService.searchUsers(searchUserData);
  }

  @Get('duplication')
  @ApiOperation({ summary: '회원정보 수정할 때 중복 username 확인용' })
  findUserByUserName(@Query() duplicateUserData: DuplicateUserDto) {
    return this.userService.findUserByUserName(duplicateUserData.username);
  }

  @Patch()
  @ApiOperation({ summary: '로그인한 유저의 정보 수정' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  modifyUser(@Req() req, @Body() updateUserData: UpdateUserDto): Promise<User> {
    const userToken = req.user;
    return this.userService.updateUserById(userToken, updateUserData);
  }

  @Get('/friend')
  @ApiOperation({ summary: '로그인한 유저의 친구 목록' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  findFriends(@Req() req): Promise<Friend[]> {
    const userToken = req.user;
    return this.userService.findFriends(userToken);
  }

  @Post('/friend/:friendId')
  @ApiOperation({ summary: '로그인한 유저가 friendId에게 친구 신청' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  requestFriend(
    @Req() req,
    @Param('friendId') friendId: string,
  ): Promise<Friend> {
    const userId: User = req.user.id;
    return this.userService.requestFriend(userId, friendId);
  }

  @Patch('/friend/:friendId')
  @ApiOperation({ summary: '로그인한 유저가 friendId의 친구 신청 수락' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  acceptFriend(
    @Req() req,
    @Param('friendId') friendId: string,
  ): Promise<Friend> {
    if (!isUUID(friendId)) {
      throw new BadRequestException('id가 uuid가 아님');
    }
    const userToken = req.user;
    return this.userService.acceptFriend(userToken, friendId);
  }

  @Post('/block/:blockId')
  @ApiOperation({ summary: '로그인한 유저가 blockId를 차단' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  blockUser(@Req() req, @Param('blockId') blockId: string) {
    if (!isUUID(blockId)) {
      throw new BadRequestException('id가 uuid가 아님');
    }
    const userToken = req.user;
    return this.userService.blockUser(userToken, blockId);
  }

  @Patch('/block/:blockId')
  @ApiOperation({ summary: '로그인한 유저가 blockId를 차단 해제' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  unblockUser(@Req() req, @Param('blockId') blockId: string) {
    if (!isUUID(blockId)) {
      throw new BadRequestException('id가 uuid가 아님');
    }
    const userToken = req.user;
    return this.userService.unblockUser(userToken, blockId);
  }

  @Get('channel')
  @ApiOperation({ summary: '로그인한 유저가 참여한 채널 정보' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  findChannels(@Req() req) {
    const userToken = req.user;
    return this.userService.findChannelByParticipant(userToken);
  }

  @Get('/:banId/ban')
  @ApiOperation({ summary: '어드민 권한을 가진 유저가 일반 사용자를 차단' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  blockUserFromService(@Req() req, @Param('banId') banId: string) {
    if (!isUUID(banId)) {
      throw new BadRequestException('id가 uuid가 아님');
    }
    const userToken = req.user;
    return this.userService.blockUserFromService(userToken, banId);
  }

  /*
  @Delete('/friend/:friend-id')
  deleteFriend(@Param('frined-id') friendId: string) {}
  */

  @Get(':id')
  @ApiOperation({ summary: '특정 유저 프로필 조회' })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  findUserById(@Param('id') userId: string): Promise<User> {
    if (!isUUID(userId)) {
      throw new BadRequestException('id가 uuid가 아님');
    }
    return this.userService.findUserById(userId);
  }
}
