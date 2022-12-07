// import { Socket } from "socket.io-client";
import { user_data } from "../login";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { socket, useSocketAuthorization } from "../../lib/socket";

export default function Dm() {
  useSocketAuthorization();
  const router = useRouter();

  const [msgList, setMsgList] = useState([]);

  useEffect(() => {
    if (!router.isReady)
      return;

    const roomId = router.query.room_id;
    axios
      .get(`/server/api/dm/msg?roomId=${roomId}`)
      .then(function (response) {
        const dmList = response.data;
        let newDmList = [];
        for (let dm of dmList)
          newDmList.push(<h3>{dm.message}</h3>);
        setMsgList(newDmList);

        socket.on(`dmMsgEvent_${roomId}`, (message) => {
          setMsgList((current) => {
            current.push(<h3>{message}</h3>);
            return [...current];
          });
        });

        router.events.on('routeChangeStart', () => {
          socket.off(`dmMsgEvent_${roomId}`);
        });
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router.isReady]);

  function onSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const msgData = {
      roomId: router.query.room_id,
      msg: event.currentTarget.message.value,
    };
    socket.emit("dmMessage", msgData);
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
