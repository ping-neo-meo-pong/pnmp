import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { socket, useSocketAuthorization } from "../lib/socket";
import { logout, getLoginUser } from "../lib/login";
import Layout from "../components/Layout";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@mui/material";
import {
  InviteModal,
  InviteModalWithUserName,
  MatchingModal,
} from "../components/InviteModal";

export default function Client() {
  console.log("This is clients");
  useSocketAuthorization();
  const router = useRouter();
  let myName: any;
  let dmRooms: any[] = [];
  let gameRooms: any[] = [];

  let [dmRoomList, setDmRoomList]: any = useState([]);
  useEffect(getDmRooms, [router.isReady]);
  let [gameRoomList, setGameRoomList]: any = useState([]);
  useEffect(getGameRooms, [router.isReady]);
  let [modal, setModal] = useState(<></>);
  let [modalOpen, setModalOpen] = useState(false);

  console.log("clients page before useEffect");
  useEffect(() => {
    if (!router.isReady) return;

    myName = getLoginUser().username;
    console.log(myName);
    function goToGameRoom(roomId: number) {
      router.push(`/game/${roomId}`);
    }
    function gameInvited(inviterId: string) {
      console.log(`you got mail~`);
    }
    socket.on("goToGameRoom", goToGameRoom);
    socket.on("gameInvited", gameInvited);

    return () => {
      socket.off("gameInvited", gameInvited);
      socket.off("goToGameRoom", goToGameRoom);
    };
  }, [router.isReady]);

  function reset() {
    getDmRooms();
    getGameRooms();
  }

  function getDmRooms() {
    if (!router.isReady) return;
    axios
      .get("/server/api/dm")
      .then(function (response) {
        dmRooms = response.data;
        let newDmRoomList = [];
        for (let dmRoom of dmRooms)
          newDmRoomList.push(<GoToDmRoom key={dmRoom.id} dmRoom={dmRoom} />);
        setDmRoomList(newDmRoomList);
      })
      .catch(() => {
        // router.push("/login");
      });
  }
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
        // router.replace("/");
      });
    socket.emit("giveMeInvited");
    socket.on(`invitedQue`, (ques) => {
      for (let que of ques) {
        newGameRoomList.push(
          <button
            key={que.inviterId}
            onClick={() => {
              socket.emit("acceptFriendQue", que.inviterId);
              socket.off(`acceptFriendQue`);
            }}
          >
            {" "}
            {que.inviterName}{" "}
          </button>
        );
      }
      setGameRoomList(...newGameRoomList);
    });

    return () => {
      socket.off(`invitedQue`);
    };
  }

  function onSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    axios
      .post(`/server/api/dm/${event.currentTarget.invitedUserName.value}`)
      .then(function (response) {
        const dmRoom = response.data;
        setDmRoomList((current: JSX.Element[]) => {
          current.push(<GoToDmRoom key={dmRoom.id} dmRoom={dmRoom} />);
          return [...current];
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  }

  function onSubmitChannelMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    axios
      .post(`/server/api/channel`, {
        channelName: "string",
        description: "string",
        password: "string",
        isPublic: true,
      })
      .then(function (response) {
        const channelRoom = response.data;
        console.log(channelRoom);
        // setDmRoomList((current: JSX.Element[]) => {
        //   current.push(
        //     <GoToDmRoom key={channelRoom.id} channelRoom={channelRoom} />
        //   );
        //   return [...current];
        // });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  }

  function onSubmitGameInvite(event: React.FormEvent<HTMLFormElement>) {
    console.log(`cookie: ${document.cookie}`);
    event.preventDefault();
    if (event.currentTarget.invitedUserId.value) {
      socket.emit(`gameToFriend`, {
        invitedUserName: event.currentTarget.invitedUserId.value,
        mode: "HARD",
      });
      socket.off(`gameToFriend`);
      router.push(`/matching`);
    } else {
      alert(`please input name`);
    }
  }

  return <Layout></Layout>;
}

function GoToDmRoom({ dmRoom }: any) {
  let router = useRouter();
  let result: JSX.Element[] = [];

  function onClickDmRoom() {
    router.push(`/dm/${dmRoom.id}`);
  }
  // function onClickGameRoom() {
  //   router.push(`/game/${dmRoom.id}`);
  // }

  return (
    <div>
      <button onClick={onClickDmRoom}>DM with {dmRoom?.otherUser?.username ?? 'null'}</button>
    </div>
  );
}

function GoToGameRoom({ gameRoom }: any) {
  let router = useRouter();
  let result: JSX.Element[] = [];

  function onClickGameRoom() {
    console.log(`come in room~`);
    console.log(gameRoom.leftUser.id);
    console.log(gameRoom.rightUser.id);

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
