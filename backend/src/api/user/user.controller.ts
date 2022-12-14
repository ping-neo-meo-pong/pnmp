import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../config/multer.config';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { SuccessOrFailDto } from '../dto/success-or-fail.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { UserBlockInfoDto } from './dto/user-block-info.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary:
      'username으로 유저를 검색, query에 username이 없으면 전체 유저를 반환',
  })
  findUsers(@Query() findUserData: FindUserDto): Promise<UserInfoDto[]> {
    return this.userService.findUsers(findUserData);
  }

  @Patch()
  @ApiOperation({ summary: '로그인한 유저의 정보 수정' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  modifyUser(
    @Req() req,
    @Body() updateUserData: UpdateUserDto,
  ): Promise<UserInfoDto> {
    const userId = req.user.id;
    return this.userService.updateUserById(userId, updateUserData);
  }

  @Patch('profile-image')
  @ApiOperation({ summary: '로그인한 유저의 프로필 이미지 수정' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
    required: false,
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('profileImage', multerOptions))
  modifyUserProfileImage(
    @Req() req,
    @UploadedFile() file: Express.Multer.File | null | undefined,
  ): Promise<UserInfoDto> {
    const userId = req.user.id;
    return this.userService.updateUserProfileImageById(
      userId,
      file?.filename ?? null,
    );
  }

  @Get('search/:username')
  @ApiOperation({ summary: '회원정보 수정할 때 중복 username 확인용' })
  searchUsers(@Param('username') username: string) {
    return this.userService.findUserByUserName(username);
  }

  @Get('/friend')
  @ApiOperation({ summary: '로그인한 유저의 친구 목록' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  findFriends(@Req() req) {
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
  ): Promise<SuccessOrFailDto> {
    if (!isUUID(friendId)) {
      throw new BadRequestException('id가 uuid가 아님');
    }
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
  ): Promise<SuccessOrFailDto> {
    if (!isUUID(friendId)) {
      throw new BadRequestException('id가 uuid가 아님');
    }
    const userId = req.user.id;
    return this.userService.acceptFriend(userId, friendId);
  }

  @Get('/block')
  @ApiOperation({ summary: '로그인한 유저의 차단 목록' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getblockUsers(@Req() req): Promise<UserBlockInfoDto[]> {
    const userId = req.user.id;
    return this.userService.getblockUsers(userId);
  }

  @Post('/block/:blockId')
  @ApiOperation({ summary: '로그인한 유저가 blockId를 차단' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  blockUser(
    @Req() req,
    @Param('blockId') blockId: string,
  ): Promise<SuccessOrFailDto> {
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
  unblockUser(
    @Req() req,
    @Param('blockId') blockId: string,
  ): Promise<SuccessOrFailDto> {
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

  @Patch('channel/:channelId')
  @ApiOperation({ summary: '로그인한 유저가 초대받은 채널에 입장' })
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'channelId',
    type: 'string',
  })
  @ApiBearerAuth()
  acceptChannelInvite(
    @Req() req,
    @Param('channelId') channelId: string,
  ): Promise<SuccessOrFailDto> {
    if (!isUUID(channelId)) {
      throw new BadRequestException('uuid가 아님');
    }
    const userId = req.user.id;
    return this.userService.acceptChannelInvite(userId, channelId);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 유저 프로필 조회' })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  findUserProfile(@Req() req, @Param('id') userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException('id가 uuid가 아님');
    }
    const loginId = req.user.id;
    return this.userService.userProfile(loginId, userId);
  }
}
