import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { DmService } from './dm.service';
import { DmRoom } from '../../core/dm/dm-room.entity';
import { CreateDmRoomDto } from '../../core/dm/dto/create-dm-room.dto';

@Controller('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @Get()
  getDmRooms(): Promise<DmRoom[]> {
    return this.dmService.getDmRooms();
  }

  @Post()
  createDmRoom(@Body() dmRoomData: CreateDmRoomDto): Promise<DmRoom> {
    return this.dmService.createDmRoom(dmRoomData);
  }

  //   @Patch()
  //   getOUtDm() {}
}
