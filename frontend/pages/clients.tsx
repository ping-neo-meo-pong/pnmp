// import { Socket } from "socket.io-client";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

import { user_data } from "./login";

export let socket: Socket;
export default function Client() {
  const router = useRouter();
  let [result, setResult]: any = useState([]);
  useEffect(useEffectHandler, []);
  function useEffectHandler() {
    socket = io("http://localhost", { transports: ["websocket"] });
	socket.on('disconnect', () => {
      console.log('disconnected');
	});
	socket.emit('send_message', 'hello');
	socket.emit('authorize', user_data._token);
    console.log(socket);
    axios
      .get("/api/dm", {
        headers: {
          Authorization: `Bearer ${user_data._token}`,
        },
      })
      .then(function (response) {
        user_data._room = response.data;
        // console.log("room:");
        // console.log(user_data._room);
        for (let i = 0; user_data._room[i]; i++) {
          console.log(i);
          result.push(
            <button
              key={user_data._room[i].id}
              onClick={() => {
                onClickDmRoom(i);
              }}
            >
              room {user_data._room[i].id}
            </button>
          );
        }
        setResult([...result]);
        console.log(result);
      })
      .catch(() => {
        router.push("/login");
      });
    function onClickDmRoom(i: number) {
      router.push(`/dm/${user_data._room[i].id}`);
    }
  }

  return (
    <div>
      <h1>Socket.io</h1>
      <GoToDmRoom />
      {result}
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
    // axios
    //   .get("/api/dm", {
    //     headers: {
    //       Authorization: `Bearer ${user_data._token}`,
    //     },
    //   })
    //   .then(function (response) {
    //     user_data._room = response.data;
    //     // console.log("room:");
    //     // console.log(user_data._room);
    //   })
    //   .catch(() => {
    //     router.push("/login");
    //   });
  }, []);
  //   console.log("retult:");
  //   console.log(result);

  return (
    <div>
      <button onClick={onClickDmRoom}>go to dm room</button>
    </div>
  );
}
