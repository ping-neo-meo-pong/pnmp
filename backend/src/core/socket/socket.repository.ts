import { UserSocket } from './dto/user-socket.dto';

export class SocketRepository {
  private map: Map<string, UserSocket>

  constructor() {
    this.map = new Map<string, UserSocket>();
  }

  find(userId: string): UserSocket {
    return this.map.get(userId);
  }

  save(userId: string, socket: UserSocket): void {
    this.map.set(userId, socket);
  }

  delete(userId: string): void {
    this.map.delete(userId);
  }
}
