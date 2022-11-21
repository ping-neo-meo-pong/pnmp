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
      .get("http://localhost/server/api/dm")
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

  function onSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    axios
      .post("http://localhost/server/api/dm", {
        invitedUserName: event.currentTarget.invitedUserName.value,
      })
      .then(function (response) {
        const dmRoom = response.data;
        setDmRoomList((current) => {
          current.push(<GoToDmRoom key={dmRoom.id} dmRoom={dmRoom} />);
          return [...current];
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  }

  return (
    <div>
      <h1>DM room list</h1>
      <form onSubmit={onSubmitMessage}>
        <button type="submit">create new DM room with </button>
        <input type="text" name="invitedUserName" />
      </form>
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
