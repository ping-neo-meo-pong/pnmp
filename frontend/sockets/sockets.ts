import { io, Socket } from "socket.io-client";

export const dmSocket: Socket = io("/dm", {
  path: "/socket.io",
  transports: ["websocket"],
});

export const channelSocket: Socket = io("/channel", {
  path: "/socket.io",
  transports: ["websocket"],
});
