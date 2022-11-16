// import { Socket } from "socket.io-client";
import { user_data, socket } from "../login";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dm() {
  const router = useRouter();
  const roomId = router.query.room_id;

  const [msgList, setMsgList] = useState([]);

  useEffect(() => {
    socket.on(`dmMsgEvent_${roomId}`, (message) => {
      msgList.push(<h3>{message}</h3>);
      setMsgList([...msgList]);
    });
    router.events.on('routeChangeStart', () => {
      socket.off(`dmMsgEvent_${roomId}`);
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
      {msgList}
    </div>
  );
}
