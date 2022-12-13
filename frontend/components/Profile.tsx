import {
  Avatar,
  Box,
  Button,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { getLoginUser } from "../lib/login";
import { useRouter } from "next/router";

export default function Profile({ userName }: any) {
  const router = useRouter();
  const me = getLoginUser();
  const [user, setUser]: any = useState({ ladder: 0 });
  const [history, setHistory]: any = useState({});
  const [testHistory, setTestHistory]: any[] = useState([]);

  console.log(me);
  useEffect(() => {
    if (!router.isReady) return;
    axios
      .get(`/server/api/user?username=${userName}`)
      .then(function (res) {
        setUser(...res.data);
        // console.log(`user:`);
        // console.log(user);
      })
      .catch((e) => {
        console.error(e);
      });

    axios
      .get(`/server/api/game/history`)
      .then(function (res) {
        let arr: any[] = [];
        let brr: any = [];

        for (let i in res.data) {
          arr.push(res.data[i]);
          let time = `${res.data[i].createdAt}`;
          brr.push(
            <div>
              {res.data[i].win}
              {" score:"} {res.data[i].score}
              {" Ladder:"} {res.data[i].ladder}
              {" time:"} {time.slice(0, 10)}
            </div>
          );
        }
        setTestHistory(brr);
        setHistory(arr);
        console.log(`history:`);
        console.log(arr);
        console.log(`brr:`);
        console.log(brr);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [router.isReady]);

  if (!router.isReady) return <></>;
  return (
    <Box>
      <ListItemButton sx={{ justifyContent: "center" }}>
        <ListItemAvatar>
          <Avatar
            sx={{ width: 100, height: 100 }}
            // alt={`Avatar n°${value + 1}`}
            // src={`/static/images/avatar/${value + 1}.jpg`}
          />
        </ListItemAvatar>
      </ListItemButton>
      <Box textAlign={"center"}>
        <Typography variant="h4" gutterBottom>
          Hi! {userName}
        </Typography>
        <Typography variant="h5" gutterBottom>
          ladder: {user.ladder} <br /> <br /> History
        </Typography>
        {testHistory}
      </Box>
    </Box>
  );
}
