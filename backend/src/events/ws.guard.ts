import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuard implements CanActivate {
  canActivate(context: any): boolean {
    const socket = context.args[0];
	console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
	console.log(socket.user);
	return true;
	/*
	if (socket.hasOwnProperty('user'))
      return true;
    else {
    console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`);
      socket.disconnect();
      return false;
    }
	*/
  }
}
