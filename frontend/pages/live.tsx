import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../lib/socket";
import Layout from "../components/Layout";
import { Button, Typography } from "@mui/material";

export default function Live() {
  const router = useRouter();
  let gameRooms: any[] = [];
  useEffect(getGameRooms, [router.isReady]);
  const [gameRoomList, setGameRoomList]: any = useState([]);

  function getGameRooms() {
    if (!router.isReady) return;
    let newGameRoomList: any[] = [];
    axios
      .get("/server/api/game")
      .then(function (response) {
        gameRooms = response.data;
        for (let gameRoom of gameRooms)
          newGameRoomList.push(
            <GoToGameRoom key={gameRoom.id} gameRoom={gameRoom} />
          );
        setGameRoomList(newGameRoomList);
      })
      .catch(() => {
        // router.push("/login");
      });
    socket.emit("giveMeInvited");
    socket.on(`invitedQue`, (ques) => {
      for (let que of ques) {
        newGameRoomList.push(
          <Button
            key={que.inviterId}
            onClick={() => {
              socket.emit("acceptFriendQue", que.inviterId);
              socket.off(`acceptFriendQue`);
              //   user_data.is_player = 1;
            }}
          >
            {que.inviterName}
          </Button>
        );
      }
      setGameRoomList(...newGameRoomList);
    });

    return () => {
      socket.off(`invitedQue`);
    };
  }

  return (
    <Layout>
      <Typography> LIVE </Typography>
      <Button
        onClick={() => {
          getGameRooms;
        }}
      >
        reset
      </Button>
      {gameRoomList}
    </Layout>
  );
}

function GoToGameRoom({ gameRoom }: any) {
  let router = useRouter();
  let result: JSX.Element[] = [];

  function onClickGameRoom() {
    console.log(`come in room~`);
    console.log(gameRoom.leftUser.id);
    console.log(gameRoom.rightUser.id);
    // console.log(user_data._id);
    // if (
    //   gameRoom.leftUser.id == user_data._id ||
    //   gameRoom.rightUser.id == user_data._id
    // ) {
    //   user_data.is_player = 1;
    // }

    router.push(`/game/${gameRoom.id}`);
  }

  return (
    <div>
      <button onClick={onClickGameRoom}>
        {gameRoom.leftUser.username} VS {gameRoom.rightUser.username}
      </button>
    </div>
  );
}
