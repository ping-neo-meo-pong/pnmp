import { Socket, io } from "socket.io-client";
// import { user_data, socket } from "../login";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { dmSocket } from "../../sockets/sockets";
import { useSocketAuthorization } from "../../lib/socket";
import { getLoginUser } from "../../lib/login";
import Layout from "../../components/Layout";
import {
  Box,
  IconButton,
  InputAdornment,
  List,
  TextField,
} from "@mui/material";
import { bodyHeight } from "../../components/constants";
import SendIcon from "@mui/icons-material/Send";

export default function Dm() {
  useSocketAuthorization();
  const router = useRouter();

  const roomId = router.query.room_id;

  const [msgList, setMsgList] = useState<any>([]);
  let loginUser: any = getLoginUser();
  const [msgToSend, setMsgToSend] = useState("");

  useEffect(() => {
    console.log("useEffect in dm[room_id]");
    if (!router.isReady) return;
    loginUser = getLoginUser();
    if (roomId) {
      console.log(`get dm from ${roomId}`);
      axios
        .get(`/server/api/dm/${roomId}`)
        .then(function (response) {
          const dmList = response.data;
          console.log(dmList);
          setMsgList(dmList);

          dmSocket.emit("dmRoom", roomId);
          dmSocket.on(`drawDm_${roomId}`, (message) => {
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

          router.events.on("routeChangeStart", () => {
            dmSocket.off(`drawDm_${roomId}`);
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [router.isReady, router.query.room_id]);

  function onSubmitMessage(message: string) {
    const msgData = {
      roomId: router.query.room_id,
      userId: loginUser.id,
      username: loginUser.username,
      msg: message,
    };
    console.log(msgData);
    dmSocket.emit(`dm`, msgData);
  }

  return (
    <Layout>
      <Box
        sx={{ display: "flex", flexDirection: "column", height: bodyHeight }}
      >
        <MessageList messages={msgList} />
        <TextField
          size="small"
          label="send message..."
          onChange={(event) => {
            setMsgToSend(event.target.value);
          }}
          value={msgToSend}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    if (msgToSend !== "") {
                      setMsgToSend("");
                      onSubmitMessage(msgToSend);
                    }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Layout>
  );
}

function MessageList({ messages }: any) {
  return (
    <List sx={{ flex: 1, overflowY: "scroll" }}>
      {messages.map((message: any) => (
        <>
          <h2 style={{ display: "inline" }}>{message?.sendUserId?.username}</h2>
          <span> {new Date(message?.createdAt).toLocaleString()}</span>
          <div style={{ fontSize: "x-large" }}>{message?.message}</div>
          <br></br>
        </>
      ))}
    </List>
  );
}
