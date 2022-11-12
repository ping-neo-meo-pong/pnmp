// import { Socket } from "socket.io-client";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

export let socket: Socket;
export default function Client() {
  let router = useRouter();
  function useEffectHandler() {
    socket = io("http://localhost", { transports: ["websocket"] });
    socket.emit("hello", "hello~");
    console.log(socket);
  }
  useEffect(useEffectHandler, []);
  function onSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let message = event.currentTarget.message.value;
    socket.emit("hello", message);
    router.push("/dm");
  }

  return (
    <div>
      <h1>Socket.io</h1>
    </div>
  );
}
