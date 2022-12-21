import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { dmSocket } from "../sockets/sockets";
import Link from "next/link";
import Layout from "../components/Layout";
import { useSocketAuthorization } from "../lib/socket";

export default function Dm() {
  useSocketAuthorization();
  const router = useRouter();
  const [invitedUser, setInvitedUser] = useState({ id: null, username: null });
  let dmRooms: any[] = [];

  const [dmRoomList, setDmRoomList]: any = useState([]);
  useEffect(getDmRooms, []);

  function getDmRooms() {
    axios
      .get("/server/api/dm")
      .then(function (response) {
        dmRooms = response.data;
        const newDmRoomList = response.data;
        setDmRoomList(newDmRoomList);
        dmSocket.emit("dmRooms", newDmRoomList);
      })
      .catch(() => {
        router.push("/login");
      });
  }

  function onSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    axios
      .post(`/server/api/dm/${invitedUser.id}`)
      .then(function (response) {
        const dmRoom = response.data;
        setDmRoomList((current: any) => {
          current.push(dmRoom);
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
      <SearchBar setInvitedUser={setInvitedUser} />
      <form onSubmit={onSubmitMessage}>
        <button type="submit">create new DM room with </button>
        <h3 style={{ display: "inline" }}> {invitedUser.username}</h3>
      </form>
      <br></br>
      {dmRoomList.map((dmRoom: any) => (
        <GoToDmRoom key={dmRoom.id} dmRoom={dmRoom} />
      ))}
    </div>
  );
}

function GoToDmRoom({ dmRoom }: any) {
  console.log(dmRoom);
  return (
    <Link href={`/dm/${dmRoom.id}`} style={{ display: "block" }}>
      DM with {dmRoom.otherUser}
    </Link>
  );
}

const displayOnFocus = () => {
  const autoSearchContainer = document.getElementById("auto-search-container");
  if (autoSearchContainer) {
    autoSearchContainer.style.display = "block";
  }
};

const displayNoneOnBlur = () => {
  const autoSearchContainer = document.getElementById("auto-search-container");
  if (autoSearchContainer) {
    autoSearchContainer.style.display = "none";
  }
};

const SearchBar = ({ setInvitedUser }: any) => {
  const [searchWord, setSearchWord] = useState("");
  const [searchUser, setSearchUser] = useState([]);

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setSearchWord(event.currentTarget.value);
  };

  const getUsersByUsername = () => {
    axios
      .get(`/server/api/user?username=${searchWord}`)
      .then(function (response) {
        console.log(response.data);
        setSearchUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onSubmit = (event: any) => {
    event.preventDefault();
    getUsersByUsername();
  };

  useEffect(() => {
    getUsersByUsername();
  }, [searchWord]);

  return (
    <Layout>
      <form style={{ minHeight: "200px" }} onSubmit={onSubmit}>
        <input
          type="text"
          autoComplete="off"
          placeholder="username을 검색하세요"
          value={searchWord}
          onChange={onChange}
          onFocus={displayOnFocus}
          // onBlur={() => {
          //   const timeEvent = setTimeout(() => {
          //     displayNoneOnBlur();
          //   }, 100);
          //   return () => clearTimeout(timeEvent);
          // }}
        />
        <button type="submit" onSubmit={onSubmit}>
          검색
        </button>
        <div
          id="auto-search-container"
          style={{
            border: "2px solid",
            width: "max-content",
            padding: "10px",
            display: "none",
          }}
        >
          {searchUser.map((user) => (
            <AutoSearch searchResult={user} setInvitedUser={setInvitedUser} />
          ))}
        </div>
        <br></br>
      </form>
    </Layout>
  );
};

const AutoSearch = ({ searchResult, setInvitedUser }: any) => {
  const selectInvitedUser = () => {
    console.log(searchResult);
    if (setInvitedUser && searchResult) {
      setInvitedUser(searchResult);
      displayNoneOnBlur();
    }
  };
  return (
    <button
      type="button"
      style={{ display: "block", width: "100%" }}
      onClick={selectInvitedUser}
    >
      {searchResult.username}
    </button>
  );
};
