import { Controller, Get, Patch, Post } from '@nestjs/common';

@Controller('api/direc-message')
export class messageController {
  @Get()
  joinDmRoom() {}

  @Post()
  makeDm() {}

  @Patch()
  getOUtDm() {}
}
