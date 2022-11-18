import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DmService } from './dm.service';
import { DmRoom } from '../../core/dm/dm-room.entity';
import { Dm } from '../../core/dm/dm.entity';
import { CreateDmRoomDto } from '../../core/dm/dto/create-dm-room.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@Controller('api/dm')
@ApiTags('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get()
  getDmRooms(@Request() request): Promise<DmRoom[]> {
    const userToken = request.user;
    return this.dmService.getDmRooms(userToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('msg')
  getDms(@Query('roomId') roomId: any): Promise<Dm[]> {
    return this.dmService.getDms(roomId);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post()
  @ApiBody({ type: CreateDmRoomDto })
  createDmRoom(
    @Request() request,
    @Body() dmRoomData: CreateDmRoomDto,
  ): Promise<DmRoom> {
    console.log('DmController.createDmRoom()');
    console.log(dmRoomData);
    const userToken = request.user;
    return this.dmService.createDmRoom(userToken, dmRoomData);
  }

  //   @Patch()
  //   getOUtDm() {}
}
