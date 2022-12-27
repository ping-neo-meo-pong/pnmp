import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Param,
} from '@nestjs/common';
import { DmService } from './dm.service';
import { DmRoom } from '../../core/dm/dm-room.entity';
import { Dm } from '../../core/dm/dm.entity';
import { AuthGuard } from '@nestjs/passport';
import { isUUID } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { SuccessOrFailDto } from '../dto/success-or-fail.dto';
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
    return this.dmService.getDmRoomsByParticipant(userId);
  }

  @Get(':roomId')
  @ApiOperation({ summary: '특정 dm방의 메세지 목록' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getDms(@Request() request, @Param('roomId') roomId: string): Promise<Dm[]> {
    if (!isUUID(roomId)) {
      throw new BadRequestException('id가 uuid가 아님');
    }
    const userId = request.user.id;
    return this.dmService.getDms(roomId, userId);
  }

  @Post(':invitedUserId')
  @ApiOperation({ summary: '로그인 한 유저가 invitedUserId와 dm 방 생성' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'invitedUserId', type: 'string' })
  createDmRoom(
    @Request() request,
    @Param('invitedUserId') invitedUserId: string,
  ): Promise<SuccessOrFailDto> {
    if (!isUUID(invitedUserId)) {
      throw new BadRequestException('id가 uuid가 아님');
    }
    const userId = request.user.id;
    return this.dmService.createDmRoom(userId, invitedUserId);
  }
}
