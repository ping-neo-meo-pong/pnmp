import { io, Socket } from "socket.io-client";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isLoggedIn } from "./login";

export const socket: Socket = io({ transports: ["websocket"] });
socket.on("disconnect", () => {
  console.log("disconnected");
});

export function useSocketAuthorization() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn())
      socket.emit("authorize");
    else
      router.push("/login");
  }, []);
}
