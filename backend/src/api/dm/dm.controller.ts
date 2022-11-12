import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  Req,
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
    const user = request.user;
    return this.dmService.getDmRooms(user.userId);
  }

  @Post()
  createDmRoom(@Body() dmRoomData: CreateDmRoomDto): Promise<DmRoom> {
    return this.dmService.createDmRoom(dmRoomData);
  }

  //   @Patch()
  //   getOUtDm() {}
}
