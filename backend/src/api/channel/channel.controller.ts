import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChannelService } from './channel.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelPasswordDto } from './dto/channel-password.dto';
import { RestrictChannelDto } from './dto/restrict-channel.dto';
import { ChangeRoleInChannelDto } from './dto/change-role-in-channel.dto';

@Controller('channel')
@ApiTags('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  @ApiOperation({ summary: '참여 가능한 채널 목록, 참여한 채널의 제외' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  allChannel(@Req() req) {
    const userId = req.user.id;
    return this.channelService.getChannels(userId);
  }

  @Post()
  @ApiOperation({ summary: '채널 생성' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  makeChannel(@Req() req, @Body() createChannelData: CreateChannelDto) {
    const userId = req.user.id;
    return this.channelService.makeChannel(userId, createChannelData);
  }

  @Delete(':channelId')
  @ApiOperation({ summary: '특정 채널 삭제' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  deleteChannel(
    @Req() req,
    @Param('channelId', ParseUUIDPipe) channelId: string,
  ) {
    const userId = req.user.id;
    return this.channelService.deleteChannel(userId, channelId);
  }

  @Post(':channelId')
  @ApiOperation({ summary: '특정 채널에 참여' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  joinChannel(
    @Req() req,
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Body() channelPassword: ChannelPasswordDto,
  ) {
    const userId = req.user.id;
    return this.channelService.joinChannels(userId, channelId, channelPassword);
  }

  @Patch(':channelId')
  @ApiOperation({ summary: '특정 채널에서 나가기' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getOutChannel(
    @Req() req,
    @Param('channelId', ParseUUIDPipe) channelId: string,
  ) {
    const userId = req.user.id;
    return this.channelService.getOutChannel(userId, channelId);
  }

  @Get(':channelId')
  @ApiOperation({ summary: '특정 채널 메세지 불러오기' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getChannelMessages(
    @Req() req,
    @Param('channelId', ParseUUIDPipe) channelId: string,
  ) {
    const userId = req.user.id;
    return this.channelService.getChannelMessages(userId, channelId);
  }

  @Get(':channelId/member')
  @ApiOperation({ summary: '특정 채널에 참여한 멤버 보기' })
  findParticipants(@Param('channelId', ParseUUIDPipe) channelId: string) {
    return this.channelService.findParticipants(channelId);
  }

  @Patch(':channelId/password')
  @ApiOperation({ summary: '채널 어드민 유저가 채널의 비밀번호는 변경/제거' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBody({ type: ChannelPasswordDto })
  changePassword(
    @Req() req,
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Body() channelPassword: ChannelPasswordDto,
  ) {
    const userId = req.user.id;
    return this.channelService.changePassword(
      userId,
      channelId,
      channelPassword,
    );
  }

  @Patch(':channelId/mute/:targetId')
  @ApiOperation({
    summary: '채널 어드민 유저가 특정 유저를 일정시간 동안 음소거',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBody({ type: RestrictChannelDto })
  muteUser(
    @Req() req,
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Param('targetId', ParseUUIDPipe) targetId: string,
    @Body() restrictChannelDto: RestrictChannelDto,
  ) {
    const userId = req.user.id;
    return this.channelService.muteUser(
      userId,
      channelId,
      targetId,
      restrictChannelDto.limitedTime,
    );
  }

  @Patch(':channelId/ban/:targetId')
  @ApiOperation({
    summary: '채널 어드민 유저가 특정 유저를 일정시간 동안 정지',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBody({ type: RestrictChannelDto })
  banUser(
    @Req() req,
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Param('targetId', ParseUUIDPipe) targetId: string,
    @Body() restrictChannelDto: RestrictChannelDto,
  ) {
    const userId = req.user.id;
    return this.channelService.banUser(
      userId,
      channelId,
      targetId,
      restrictChannelDto.limitedTime,
    );
  }

  @Patch(':channelId/block/:targetId')
  @ApiOperation({ summary: '채널 어드민 유저가 특정 유저를 강퇴' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBody({ type: RestrictChannelDto })
  blockUserFromChannel(
    @Req() req,
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Param('targetId', ParseUUIDPipe) targetId: string,
  ) {
    const userId = req.user.id;
    return this.channelService.blockUserFromChannel(
      userId,
      channelId,
      targetId,
    );
  }

  @Patch(':channelId/role/:targetId')
  @ApiOperation({ summary: '채널/웹 어드민 유저가 특정 유저 권한을 부여/제거' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBody({ type: ChangeRoleInChannelDto })
  roleUser(
    @Req() req,
    @Param('channelId') channelId: string,
    @Param('targetId') targetId: string,
    @Body() changeRole: ChangeRoleInChannelDto,
  ) {
    const userId = req.user.id;
    return this.channelService.changeRoleInChannel(
      userId,
      channelId,
      targetId,
      changeRole,
    );
  }

  @Post(':channelId/invite/:targetId')
  @ApiOperation({ summary: '특정 채널에 사용자 초대하기' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBody({ type: ChangeRoleInChannelDto })
  inviteUser(
    @Req() req,
    @Param('channelId') channelId: string,
    @Param('targetId') targetId: string,
  ) {
    const userId = req.user.id;
    return this.channelService.inviteUser(userId, channelId, targetId);
  }
}
