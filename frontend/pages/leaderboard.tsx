import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { socket, useSocketAuthorization } from "../lib/socket";
import Layout from "../components/Layout";
import { Button, Typography } from "@mui/material";

export default function LeaderBoard() {
  useSocketAuthorization();
  const router = useRouter();
  let users: any[] = [];
  useEffect(getUsers, [router.isReady]);
  const [UserList, setUserList]: any = useState([]);

  function getUsers() {
    if (!router.isReady) return;
    let newUserList: any[] = [];
    axios
      .get("/server/api/user")
      .then(function (response) {
        users = response.data.sort(function (a: any, b: any) {
          return b.ladder - a.ladder;
        });
        console.log(users);
        for (let User of users)
          newUserList.push(<GoToUser key={User.id} User={User} />);
        setUserList(newUserList);
      })
      .catch(() => {
        // router.push("/login");
      });

    return () => {
      socket.off(`invitedQue`);
    };
  }

  return (
    <Layout>
      <Typography> LeaderBoard </Typography>
      <Button
        onClick={() => {
          getUsers;
        }}
      >
        reset
      </Button>
      {UserList}
    </Layout>
  );
}

function GoToUser({ User }: any) {
  let router = useRouter();
  let result: JSX.Element[] = [];

  function onClickUser() {
    router.push(`/profile/${User.id}`);
  }

  return (
    <div>
      <button onClick={onClickUser}>
        {User.username} {"ladder: "} {User.ladder}
      </button>
    </div>
  );
}
