import { Socket, io } from "socket.io-client";
// import { user_data, socket } from "../login";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { channelSocket } from "../../sockets/sockets";
import { useSocketAuthorization } from "../../lib/socket";
import { getLoginUser } from "../../lib/login";
import Layout from "../../components/Layout";

export default function Dm() {
  useSocketAuthorization();
  const router = useRouter();

  const roomId = `${router.query.room_id}`;

  const [msgList, setMsgList] = useState<any>([]);
  let loginUser: any = getLoginUser();

  useEffect(() => {
    console.log("useEffect in cm[room_id]");
    if (!router.isReady) return;
    loginUser = getLoginUser();
    if (roomId) {
      console.log(`get cm from ${roomId}`);
      axios
        .get(`/server/api/channel/${roomId}`)
        .then(function (response) {
          const messageList = response.data;
          console.log(messageList);
          setMsgList(messageList);

          channelSocket.emit("channelRoom", roomId);
          channelSocket.on(`drawChannelMessage`, (message) => {
            console.log(`draw cm`);
            console.log(message);
            if (
              !(
                loginUser.id !== message.sendUserId.id &&
                message.isSendUserBlocked
              )
            )
              setMsgList((current: any) => {
                current.push(message);
                return [...current];
              });
          });

          //   router.events.on("routeChangeStart", () => {
          //     channelSocket.off(`drawChannelMessage`);
          //   });
        })
        .catch(() => {
          // router.push("/login", );
        });
    }
  }, [router.isReady, router.query.room_id]);

  function onSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const msgData = {
      roomId: router.query.room_id,
      userId: loginUser.id,
      username: loginUser.username,
      msg: event.currentTarget.message.value,
    };
    console.log(msgData);
    channelSocket.emit(`channelMessage`, msgData);
  }

  return (
    <Layout>
      <h1>Channel</h1>
      <form id="username" onSubmit={onSubmitMessage}>
        <input type="text" id="message" name="message" />
        <button type="submit">send_message</button>
      </form>
      {msgList.map((msg: any) => (
        <ChannelMessage key={msg?.id} channelMessage={msg} />
      ))}
    </Layout>
  );
}

function ChannelMessage({ channelMessage }: any) {
  const date = new Date(channelMessage?.createdAt);
  return (
    <div>
      <h2 style={{ display: "inline" }}>
        {channelMessage?.sendUserId?.username}
      </h2>
      <span> {date.toLocaleString()}</span>
      <div style={{ fontSize: "x-large" }}>{channelMessage?.message}</div>
      <br></br>
    </div>
  );
}
