import { io, Socket } from "socket.io-client";
import { isLoggedIn } from "./login.ts";

export let socket: Socket = null;

if (isLoggedIn()) {
  console.log('socket.ts');
  socket = io({ transports: ["websocket"] });
}
