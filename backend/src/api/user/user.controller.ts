import {
  Body,
  Controller,
  // Delete,
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
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { isUUID } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { Friend } from '../../core/friend/friend.entity';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary:
      'username으로 유저를 검색, query에 username이 없으면 전체 유저를 반환',
  })
  findUsers(@Query() findUserData: FindUserDto): Promise<User[]> {
    return this.userService.findUsers(findUserData);
  }

  @Get('search/:username')
  @ApiOperation({ summary: '회원정보 수정할 때 중복 username 확인용' })
  searchUsers(@Param('username') username: string) {
    return this.userService.findUserByUserName(username);
  }

  @Patch()
  @ApiOperation({ summary: '로그인한 유저의 정보 수정' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  modifyUser(@Req() req, @Body() updateUserData: UpdateUserDto): Promise<User> {
    const userId = req.user.id;
    return this.userService.updateUserById(userId, updateUserData);
  }

  @Get('/friend')
  @ApiOperation({ summary: '로그인한 유저의 친구 목록' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  findFriends(@Req() req): Promise<Friend[]> {
    const userId = req.user.id;
    return this.userService.findFriends(userId);
  }

  @Post('/friend/:friendId')
  @ApiOperation({ summary: '로그인한 유저가 friendId에게 친구 신청' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  requestFriend(
    @Req() req,
    @Param('friendId') friendId: string,
  ): Promise<Friend> {
    const userId = req.user.id;
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
    const userId = req.user.id;
    return this.userService.acceptFriend(userId, friendId);
  }

  /*
  @Delete('/friend/:friend-id')
  deleteFriend(@Param('frined-id') friendId: string) {}
  */

  @Post('/block/:blockId')
  @ApiOperation({ summary: '로그인한 유저가 blockId를 차단' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  blockUser(@Req() req, @Param('blockId') blockId: string) {
    if (!isUUID(blockId)) {
      throw new BadRequestException('id가 uuid가 아님');
    }
    const userId = req.user.id;
    return this.userService.blockUser(userId, blockId);
  }

  @Patch('/block/:blockId')
  @ApiOperation({ summary: '로그인한 유저가 blockId를 차단 해제' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  unblockUser(@Req() req, @Param('blockId') blockId: string) {
    if (!isUUID(blockId)) {
      throw new BadRequestException('id가 uuid가 아님');
    }
    const userId = req.user.id;
    return this.userService.unblockUser(userId, blockId);
  }

  @Get('channel')
  @ApiOperation({ summary: '로그인한 유저가 참여한 채널 정보' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  findChannels(@Req() req) {
    const userId = req.user.id;
    return this.userService.findChannelByParticipant(userId);
  }

  @Get('/:banId/ban')
  @ApiOperation({ summary: '어드민 권한을 가진 유저가 일반 사용자를 차단' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  blockUserFromService(@Req() req, @Param('banId') banId: string) {
    if (!isUUID(banId)) {
      throw new BadRequestException('id가 uuid가 아님');
    }
    const userId = req.user.id;
    return this.userService.blockUserFromService(userId, banId);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 유저 프로필 조회' })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  findUserProfile(@Param('id') userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException('id가 uuid가 아님');
    }
    return this.userService.findUserProfile(userId);
  }
}
