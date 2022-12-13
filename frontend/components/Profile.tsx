import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { getLoginUser } from "../lib/login";

export default function Profile({ userName }: any) {
  const me = getLoginUser();
  const [user, setUser]: any = useState({ ladder: 0 });
  const [history, setHistory]: any = useState({});
  console.log(me);
  useEffect(() => {
    axios
      .get(`/server/api/user?username=${userName}`)
      .then(function (res) {
        setUser(...res.data[0]);
        console.log(`user:`);
        console.log(user);
      })
      .catch((e) => {
        console.error(e);
      });

    // axios
    //   .get(`/server/api/history`)
    //   .then(function (res) {
    //     setHistory(res.data[0]);
    //     console.log(`history:`);
    //     console.log(history);
    //   })
    //   .catch((e) => {
    //     console.error(e);
    //   });
  }, []);

  return (
    <Box>
      Hi! {userName} <br /> ladder: {user.ladder}
    </Box>
  );
}
