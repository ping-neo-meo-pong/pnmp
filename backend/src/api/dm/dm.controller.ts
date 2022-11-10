import { Controller, Get, Patch, Post } from '@nestjs/common';

@Controller('dm')
export class DmController {
  @Get()
  joinDmRoom() {}

  @Post()
  makeDm() {}

  @Patch()
  getOUtDm() {}
}
