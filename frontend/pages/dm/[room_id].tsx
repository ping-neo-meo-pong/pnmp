// import { Socket } from "socket.io-client";
import { socket } from "../clients";
import { user_data } from "../login";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

let roomId: any;
export default function Dm() {
  const router = useRouter();
  useEffect(() => {
    axios
      .get("/api/dm", {
        headers: {
          Authorization: `Bearer ${user_data._token}`,
        },
      })
      .then(function (response) {
        console.log(`dm:`);
        console.log(user_data._room);
        console.log("dm: jwt access");
        console.log(router.query.room_id);
        socket.emit("pleaseMakeRoom", router.query.room_id); //user_data._room[i].id);
        socket.on("roomId", (_roomId) => {
          roomId = _roomId;
        });
        socket.on("server_message", (message) => {
          console.log(message);
        });
      })
      .catch(() => {
        console.log(`dm: go to login`);
        router.push("/login");
      });
  }, []);
  function onSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let data = [];
    data.push(roomId);
    data.push(event.currentTarget.message.value);
    console.log(socket.id);
    socket.emit("send_message", data);
    // socket.emit("id", socket.id);
  }
  return (
    <div>
      <h1>dm</h1>
      <form id="username" onSubmit={onSubmitMessage}>
        <input type="text" id="message" name="message" />
        <button type="submit">send_message</button>
      </form>
    </div>
  );
}
