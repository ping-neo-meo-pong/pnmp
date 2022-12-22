import { io, Socket } from "socket.io-client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { isLoggedIn, getLoginUser } from "./login";

export const socket: Socket = io({ transports: ["websocket"] });
socket.on("disconnect", () => {
  console.log("disconnected");
});

export function useSocketAuthorization() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      console.log(localStorage.loginUser);
      console.log(`jwt: ${localStorage.loginUser.jwt}`);
      socket.emit("authorize", getLoginUser().jwt);
    } else router.replace("/clients", "/", undefined, { shallow: true });
  }, []);
}
