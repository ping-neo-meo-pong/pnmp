import {
  Avatar,
  Box,
  Button,
  Grid,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { getLoginUser } from "../lib/login";
import { useRouter } from "next/router";
import { InviteModalWithUserName } from "./InviteModal";

export default function Profile({ userName }: any) {
  const router = useRouter();
  const me = getLoginUser();
  //   const [user, setUser]: any = useState({});
  const [userLadder, setUserLadder]: any = useState(0);
  const [history, setHistory]: any = useState({});
  const [testHistory, setTestHistory]: any[] = useState([]);
  const [inviteModal, setInviteModal] = useState(<></>);

  console.log(me);
  useEffect(() => {
    if (!router.isReady) return;
    // let user: any = {};
    axios
      .get(`/server/api/user?username=${userName}`)
      .then(function (res) {
        // setUser(...res.data);
        // setUser(res.data[0]);
        const user = res.data[0];
        setUserLadder(user.ladder);
        console.log(`user:`);
        console.log(user);
        console.log(`${me.username} vs ${userName}`);
        if (me.username != userName) {
          setInviteModal(<InviteModalWithUserName userName={userName} />);
        } else {
          setInviteModal(<></>);
        }

        axios
          .get(`/server/api/user/${user.id}`)
          .then(function (res) {
            let arr: any[] = [];
            let brr: any = [];
            const historys = res.data.matchHistory;
            // console.log(`history data`);
            // console.log(res.data);

            for (let i in historys) {
              arr.push(historys[i]);
              let time = `${historys[i].gameRoom.createdAt}`;
              brr.push(
                <Box>
                  <Grid container spacing={0}>
                    <Grid item xs={3}></Grid>
                    <Grid
                      item
                      xs={2}
                      sx={{
                        color: historys[i].user.win == "WIN" ? "blue" : "red",
                      }}
                    >
                      {historys[i].user.win}
                    </Grid>
                    <Grid item xs={3}>
                      {userName} {" VS"} {historys[i].other.profile.username}{" "}
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={12}>
                      {" score:"} {historys[i].user.score}
                      {" Ladder:"} {historys[i].user.ladder}
                      {" time:"} {time.slice(0, 10)}
                    </Grid>
                  </Grid>
                  <br />
                </Box>
              );
            }
            setTestHistory(brr);
            setHistory(arr);
            // console.log(`history:`);
            // console.log(arr);
            // console.log(`brr:`);
            // console.log(brr);
          })
          .catch((e) => {
            console.error(e);
          });
      })
      .catch((e) => {
        console.error(e);
      });
    // if (user.ladder == 0) router.push("/clients");
  }, [router.isReady, userName]);

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
        {inviteModal}
        <br />
        <Typography variant="h5" gutterBottom>
          ladder: {userLadder} <br /> <br /> History
        </Typography>
        {testHistory}
      </Box>
    </Box>
  );
}
