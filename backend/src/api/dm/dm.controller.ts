import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DmService } from './dm.service';
import { DmRoom } from '../../core/dm/dm-room.entity';
import { CreateDmRoomDto } from '../../core/dm/dto/create-dm-room.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getDmRooms(@Request() request): Promise<DmRoom[]> {
    const userToken = request.user;
    return this.dmService.getDmRooms(userToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createDmRoom(
    @Request() request,
    @Body() dmRoomData: CreateDmRoomDto,
  ): Promise<DmRoom> {
    const userToken = request.user;
    return this.dmService.createDmRoom(userToken, dmRoomData);
  }

  //   @Patch()
  //   getOUtDm() {}
}
