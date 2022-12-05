import { io, Socket } from "socket.io-client";

export const dmSocket: Socket = io("/dm", {
  path: "/socket.io",
  transports: ["websocket"],
});
