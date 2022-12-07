import { io, Socket } from "socket.io-client";
import { useEffect } from 'react';

export const socket: Socket = io({ transports: ["websocket"] });
socket.on("disconnect", () => {
  console.log("disconnected");
});

export function useSocketAuthorization() {
  useEffect(() => {
    socket.emit("authorize");
  }, []);
}
