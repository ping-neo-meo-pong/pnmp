import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { user_data, socket } from "./login";

export default function Client() {
  const router = useRouter();

  let [dmRoomList, setDmRoomList]: any = useState([]);
  useEffect(getDmRooms, []);

  function getDmRooms() {
    axios
      .get("http://localhost:8000/api/dm", { withCredentials: true })
      .then(function (response) {
        user_data._room = response.data;
        let newDmRoomList = [];
        for (let dmRoom of user_data._room)
          newDmRoomList.push(<GoToDmRoom key={dmRoom.id} dmRoom={dmRoom} />)
        setDmRoomList(newDmRoomList);
      })
      .catch(() => {
        router.push("/login");
      });
  }

  return (
    <div>
      <h1>DM room list</h1>
      {dmRoomList}
    </div>
  );
}

function GoToDmRoom({ dmRoom }) {
  let router = useRouter();
  let result: JSX.Element[] = [];

  function onClickDmRoom() {
    router.push(`/dm/${dmRoom.id}`);
  }

  return (
    <div>
      <button onClick={onClickDmRoom}>DM with {dmRoom.otherUser}</button>
    </div>
  );
}
