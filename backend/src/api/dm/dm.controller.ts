import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { DmService } from './dm.service';
import { DmRoom } from '../../core/dm/dm-room.entity';
import { Dm } from '../../core/dm/dm.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@Controller('dm')
@ApiTags('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @Get()
  @ApiOperation({ summary: '로그인 한 유저가 참여한 dm 목록' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getDmRooms(@Request() request): Promise<DmRoom[]> {
    const userId = request.user.id;
    return this.dmService.getDmRooms(userId);
  }

  @Get('msg')
  @ApiOperation({ summary: '특정 dm방의 메세지 목록' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getDms(@Query('roomId') roomId: any): Promise<Dm[]> {
    return this.dmService.getDms(roomId);
  }

  @Post(':invitedUserId')
  @ApiOperation({ summary: '로그인 한 유저가 invitedUserId와 dm 방 생성' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'invitedUserId', type: 'string' })
  createDmRoom(
    @Request() request,
    @Param('invitedUserId') invitedUserId: string,
  ): Promise<DmRoom> {
    const userId = request.user.id;
    return this.dmService.createDmRoom(userId, invitedUserId);
  }

  //   @Patch()
  //   getOUtDm() {}
}
