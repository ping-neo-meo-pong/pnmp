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
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('dm')
@ApiTags('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getDmRooms(@Request() request): Promise<DmRoom[]> {
    const userToken = request.user;
    return this.dmService.getDmRooms(userToken);
  }

  @Get('msg')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getDms(@Query('roomId') roomId: any): Promise<Dm[]> {
    return this.dmService.getDms(roomId);
  }

  @Post(':invitedUserId')
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
