import { Socket, io } from "socket.io-client";
// import { user_data, socket } from "../login";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { channelSocket } from "../../sockets/sockets";
import { useSocketAuthorization } from "../../lib/socket";
import { getLoginUser } from "../../lib/login";
import Layout from "../../components/Layout";

export default function Channel() {
  useSocketAuthorization();
  const router = useRouter();

  const roomId = `${router.query.room_id}`;
  const [roomName, setRoomName] = useState("default");

  const [msgList, setMsgList] = useState<any>([]);
  let loginUser: any = getLoginUser();

  useEffect(() => {
    console.count("useEffect in cm[room_id]");
    if (!router.isReady) return;
    loginUser = getLoginUser();
    if (roomId) {
      console.log(`get cm from ${roomId}`);
      axios.get(`/server/api/user/channel`).then(function (res) {
        const chList = res.data.channels;
        for (const ch of chList) {
          if (ch.id == roomId) {
            setRoomName(ch.channelName);
          }
        }
      });
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
            let blockUsers: any[] = [];
            let isSendUserBlocked: Boolean = false;
            axios.get(`/server/api/user/block`).then(function (res) {
              blockUsers = res.data;
              console.log(blockUsers);
              for (let block of blockUsers) {
                console.log(
                  `${message.sendUserId.id} vs ${block.blockedUserId.id}`
                );
                if (message.sendUserId.id == block.blockedUserId.id) {
                  console.log(`blocked!!`);
                  isSendUserBlocked = true;
                }
              }
              if (
                !(loginUser.id !== message.sendUserId.id && isSendUserBlocked)
              ) {
                setMsgList((current: any) => {
                  current.push(message);
                  return [...current];
                });
              }
            });
          });

          router.events.on("routeChangeStart", () => {
            channelSocket.off(`drawChannelMessage`);
          });
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
      <h1>{roomName}</h1>
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
