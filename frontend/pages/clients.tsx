// import { Socket } from "socket.io-client";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

import { user_data } from "./login";

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
  }

  return (
    <div>
      <h1>Socket.io</h1>
      <GoToDmRoom />
    </div>
  );
}

function GoToDmRoom() {
  let router = useRouter();
  let result: JSX.Element[] = [];
  function onClickDmRoom() {
    router.push("/dm");
  }
  useEffect(() => {
    let rooms;
    axios
      .get("/api/dm", {
        headers: {
          Authorization: `Bearer ${user_data._token}`,
        },
      })
      .then(function (response) {
        rooms = response.data;
        console.log("room:");
        console.log(rooms);
        for (let i = 0; rooms[i]; i++) {
          console.log(`room! for${i}`);
          result.push(<div>Room</div>);
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, []);
  console.log("retult:");
  console.log(result);
  return (
    <div>
      <button onClick={onClickDmRoom}>go to dm room</button>
    </div>
  );
}
