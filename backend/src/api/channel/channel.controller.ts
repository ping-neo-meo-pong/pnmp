import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('api/channel')
export class ChannelController {
  @Get()
  allChannel() {}

  @Get('/joined-channel')
  joinedChannel() {}

  @Post()
  makeChannel() {}

  @Delete(':channel-id')
  deleteChannel(@Param('channel-id') channelId: string) {}

  @Post(':channel-id')
  joinChannel(@Param('channel-id') channelId: string) {}

  @Patch(':channel-id')
  getOutChannel(@Param('channel-id') channelId: string) {}

  @Get(':channel-id')
  findParticipation(@Param('channel-id') channelId: string) {}

  @Patch(':channe-id/password')
  changePassword(@Param('channel-id') channelId: string) {}

  @Patch(':channel-id/mute/:user-id')
  muteUser(
    @Param('channel-id') channelId: string,
    @Param('user-id') userId: string,
  ) {}

  @Patch(':channel-id/ban/:user-id')
  banUser(
    @Param('channel-id') channelId: string,
    @Param('user-id') userId: string,
  ) {}

  @Patch(':channel-id/block/:user-id')
  blockUser(
    @Param('channel-id') channelId: string,
    @Param('user-id') userId: string,
  ) {}

  @Patch(':channel-id/role/:user-id')
  roleUser(
    @Param('channel-id') channelId: string,
    @Param('user-id') userId: string,
  ) {}
}
