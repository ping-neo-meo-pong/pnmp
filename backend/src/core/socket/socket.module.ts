import { Module } from '@nestjs/common';
import { SocketRepository } from './socket.repository';

@Module({
  providers: [SocketRepository],
  exports: [SocketRepository],
})
export class SocketModule {}
