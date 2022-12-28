import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { socket, useSocketAuthorization } from "../lib/socket";
import Layout from "../components/Layout";
import { Box, Button, Typography } from "@mui/material";

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
      .catch((e) => {
        console.error(e);
      });

    return () => {
      socket.off(`invitedQue`);
    };
  }

  return (
    <Layout>
		<Box sx={{
            width: 300,
            mx: "auto", // margin left & right
            my: 4, // margin top & botom
            py: 3, // padding top & bottom
            px: 2, // padding left & right
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: "sm",
            boxShadow: "md",
			alignItems: "center"
          }} >
      <Typography variant="h3"> LeaderBoard </Typography>
      <Button
        onClick={() => {
          getUsers;
        }}
      >
        reset
      </Button>
      {UserList}
	  </Box>
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
