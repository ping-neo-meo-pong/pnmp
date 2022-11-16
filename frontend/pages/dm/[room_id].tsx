// import { Socket } from "socket.io-client";
import { socket } from "../clients";
import { user_data } from "../login";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Dm() {
  const router = useRouter();
  const roomId = router.query.room_id;

  useEffect(() => {
    socket.on(`dmMsgEvent_${roomId}`, (message) => {
      console.log(message);
    });
  }, []);

  function onSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const msgData = {
      roomId: router.query.room_id,
      msg: event.currentTarget.message.value,
    };
    socket.emit("send_message", msgData);
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
