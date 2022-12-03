import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { user_data, socket } from "./login";

export default function Client() {
  const router = useRouter();

  let [dmRoomList, setDmRoomList]: any = useState([]);
  useEffect(getDmRooms, []);
  let [gameRoomList, setGameRoomList]: any = useState([]);
  useEffect(getGameRooms, []);

  useEffect(() => {
    user_data.is_player = 0;
    socket.on('goToGameRoom', (roomId) => {
      router.push(`/game/${roomId}`);
    });
  }, []);

  function getDmRooms() {
    axios
      .get("/server/api/dm")
      .then(function (response) {
        user_data._room = response.data;
        let newDmRoomList = [];
        for (let dmRoom of user_data._room)
          newDmRoomList.push(<GoToDmRoom key={dmRoom.id} dmRoom={dmRoom} />);
        setDmRoomList(newDmRoomList);
      })
      .catch(() => {
        router.push("/login");
      });
  }
  function getGameRooms() {
    axios.get("/server/api/game").then(function (response) {
      user_data.game_room = response.data;
      let newGameRoomList = [];
      for (let gameRoom of user_data.game_room)
        newGameRoomList.push(
          <GoToGameRoom key={gameRoom.id} gameRoom={gameRoom} />
        );
      setGameRoomList(newGameRoomList);
    });
  }
  function onClickGameRoom() {
    router.push(`/game/test`); //${user_data._name}`);
  }

  function onSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    axios
      .post(
        `/server/api/dm/${event.currentTarget.invitedUserName.value}`
      )
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

  function onSubmitGameInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    axios
      .post(`/server/api/game`, {
        invitedUserId: event.currentTarget.invitedUserId.value,
      })
      .then(function (response) {
        const gameRoom = response.data;
        setGameRoomList((current: JSX.Element[]) => {
          current.push(<GoToGameRoom key={gameRoom.id} gameRoom={gameRoom} />);
          return [...current];
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  }

  return (
    <div>
      <h1>HI {user_data._name}</h1>
      <h1>DM room list</h1>
      <form onSubmit={onSubmitMessage}>
        <button type="submit">create new DM room with </button>
        <input type="text" name="invitedUserName" />
      </form>
      {dmRoomList}

      <h1>Game room list</h1>
      <form onSubmit={onSubmitGameInvite}>
        <button type="submit">create new Game room with </button>
        <input type="text" name="invitedUserId" />
      </form>
      {gameRoomList}

      <h1>Random Maching</h1>
      <button onClick={async () => {
        await router.push(`/matching`);
        socket.emit('gameMatching', "NOMAL");
      }}>Maching Mode 1</button>
      <button onClick={async () => {
        await router.push(`/matching`);
        socket.emit('gameMatching', "HARD");
      }}>Maching Mode 2</button>
    </div>
  );
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
      <button onClick={onClickDmRoom}>DM with {dmRoom.otherUser}</button>
    </div>
  );
}

function GoToGameRoom({ gameRoom }: any) {
  let router = useRouter();
  let result: JSX.Element[] = [];

  function onClickGameRoom() {
    console.log(`come in room~`);
    console.log(gameRoom.leftUser.username);
    console.log(gameRoom.rightUser.username);
    console.log(user_data._name);
    if (gameRoom.leftUser.username == user_data._name ||
      gameRoom.rightUser.username == user_data._name) {
        user_data.is_player = 1;
    }

    router.push(`/game/${gameRoom.id}`);
  }

  return (
    <div>
      <button onClick={onClickGameRoom}>{gameRoom.leftUser.username} VS {gameRoom.rightUser.username}</button>
    </div>
  );
}
