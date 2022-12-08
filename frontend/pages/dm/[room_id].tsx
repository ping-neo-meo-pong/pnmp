import { Socket, io } from "socket.io-client";
// import { user_data, socket } from "../login";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { dmSocket } from "../../sockets/sockets";
import { useSocketAuthorization } from "../../lib/socket";
import { getLoginUser } from "../../lib/login";

export default function Dm() {
  useSocketAuthorization();
  const router = useRouter();

  const roomId = router.query.room_id;

  const [msgList, setMsgList] = useState<any>([]);
  let loginUser: any = getLoginUser();

  useEffect(() => {
    if (!router.isReady) return;
    loginUser = getLoginUser();
    console.log(loginUser);
    if (roomId) {
      axios
        .get(`/server/api/dm/msg?roomId=${roomId}`)
        .then(function (response) {
          const dmList = response.data;
          console.log(dmList);
          setMsgList(dmList);

          dmSocket.emit("dmRoom", roomId);
          dmSocket.on(`drawDm`, (message) => {
            console.log(message);
            setMsgList((current: any) => {
              current.push(message);
              return [...current];
            });
          });

          router.events.on("routeChangeStart", () => {
            dmSocket.off(`drawDm`);
          });
        })
        .catch(() => {
          // router.push("/login", );
        });
    }
  }, [router.isReady]);

  function onSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const msgData = {
      roomId: router.query.room_id,
      userId: loginUser.id,
      username: loginUser.username,
      msg: event.currentTarget.message.value,
    };
    console.log(msgData);
    dmSocket.emit(`dm`, msgData);
  }

  return (
    <div>
      <h1>dm</h1>
      <form id="username" onSubmit={onSubmitMessage}>
        <input type="text" id="message" name="message" />
        <button type="submit">send_message</button>
      </form>
      {msgList.map((msg: any) => (
        <DmMessage key={msg?.id} dm={msg} />
      ))}
    </div>
  );
}

function DmMessage({ dm }: any) {
  const date = new Date(dm?.createdAt);
  return (
    <div>
      <h2 style={{ display: "inline" }}>{dm?.sendUserId?.username}</h2>
      <span> {date.toLocaleString()}</span>
      <div style={{ fontSize: "x-large" }}>{dm?.message}</div>
      <br></br>
    </div>
  );
}
