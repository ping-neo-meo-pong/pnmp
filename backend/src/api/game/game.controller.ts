import { Controller, Patch, Post } from '@nestjs/common';

@Controller('/api/game')
export class gameController {
  @Post()
  makeGame() {}

  @Patch()
  correctionMatchingHistory() {}
}
