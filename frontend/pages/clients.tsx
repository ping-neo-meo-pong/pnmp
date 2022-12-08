import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { user_data } from "./login";
import { socket, useSocketAuthorization } from "../lib/socket";
import { logout, getLoginUser } from "../lib/login";

export default function Client() {
  useSocketAuthorization();
  const router = useRouter();

  let [dmRoomList, setDmRoomList]: any = useState([]);
  useEffect(getDmRooms, [router.isReady]);
  let [gameRoomList, setGameRoomList]: any = useState([]);
  useEffect(getGameRooms, [router.isReady]);

  console.log("clients page before useEffect");
  useEffect(() => {
    if (!router.isReady) return;

    user_data._name = getLoginUser().username;
    console.log(user_data._name);
    function goToGameRoom(roomId: number) {
      router.push(`/game/${roomId}`);
    }
    function gameInvited(inviterId: string) {
      console.log(`you got mail~`);
      // if (confirm(`invited by ${inviterId}\nplaying?`) == true) {
      //   user_data.is_player = 1;
      //   socket.emit('acceptFriendQue', inviterId);
      //   socket.off(`acceptFriendQue`,);
      // }
      // else {}
    }
    user_data.is_player = 0;
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
        user_data._room = response.data;
        let newDmRoomList = [];
        for (let dmRoom of user_data._room)
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
        user_data.game_room = response.data;
        for (let gameRoom of user_data.game_room)
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
          <button
            key={que.inviterId}
            onClick={() => {
              socket.emit("acceptFriendQue", que.inviterId);
              socket.off(`acceptFriendQue`);
              user_data.is_player = 1;
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

  return (
    <div>
      <h1>
        HI {user_data._name}
        <button
          onClick={() => {
            router.push("/profile");
          }}
        >
          <h1> 프로필 </h1>
        </button>
      </h1>
      <button
        onClick={async () => {
          await logout();
          router.push("/login");
        }}
      >
        logout
      </button>
      <button onClick={reset}>
        {" "}
        <h1>list 다시 불러오기</h1>{" "}
      </button>
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
      <button
        onClick={async () => {
          await router.push(`/matching`);
          socket.emit("gameMatching", "NOMAL");
        }}
      >
        Maching Mode 1
      </button>
      <button
        onClick={async () => {
          await router.push(`/matching`);
          socket.emit("gameMatching", "HARD");
        }}
      >
        Maching Mode 2
      </button>
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
    console.log(gameRoom.leftUser.id);
    console.log(gameRoom.rightUser.id);
    console.log(user_data._id);
    if (
      gameRoom.leftUser.id == user_data._id ||
      gameRoom.rightUser.id == user_data._id
    ) {
      user_data.is_player = 1;
    }

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
