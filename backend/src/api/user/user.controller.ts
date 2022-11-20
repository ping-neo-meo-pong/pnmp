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
import { SearchUserDto } from '../../core/user/dto/search-user.dto';
import { UpdateUserDto } from '../../core/user/dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { isUUID } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { DuplicateUserDto } from '../../core/user/dto/duplicate-user.dto copy';

@Controller('api/user')
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

  @Patch()
  @ApiOperation({ summary: '로그인한 유저의 정보 수정' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  modifyUser(@Req() req, @Body() updateUserData: UpdateUserDto) {
    const userToken = req.user;
    return this.userService.updateUserById(userToken, updateUserData);
  }

  /*
  @Get('/friend')
  findFriend(@Param('id') userId: string) {}

  @Post('/friend/:friend-id')
  requestFriend(@Param('friend-id') friendId: string) {}

  @Patch('/friend/:friend-id')
  acceptFriend(@Param('friend-id') friendId: string) {}

  @Delete('/friend/:friend-id')
  deleteFriend(@Param('frined-id') friendId: string) {}

  @Post('/block/:block-id')
  userBlock(@Param('block-id') blockId: string) {}

  @Patch('/block/:block-id')
  liftBlockUser(@Param('block-id') blockId: string) {}
  */
}
