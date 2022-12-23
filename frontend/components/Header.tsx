import { useState, useEffect } from "react";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import UserMenu from "./UserMenu";
import { getLoginUser } from "../lib/login";
import { MatchingModal } from "./InviteModal";
import { useRouter } from "next/router";
import Notifications from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import NotificationMenu from "./NotificationMenu";
import axios from "axios";

export default function Header({ title }: any) {
  const [userName, setUserName] = useState<string>("");
  const [userImage, setUserImage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const me = getLoginUser();
    setUserName(me.username);
    axios
      .get(`/server/api/user/${me.id}`)
      .then((res) => {
        console.log("res.data");
        console.log(res.data);
        setUserImage(res.data.profileImage);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [router.query]);

  return (
    <>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Typography
          onClick={() => {
            router.push("/clients");
          }}
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
        <NotificationMenu />
      </Toolbar>
      <Grid container spacing={2} sx={{ py: 2 }}>
        <Grid item xs={12} md={9} sx={{ display: "flex" }}>
          <Box sx={{ display: "inline", flex: 1 }}>
            <MatchingModal />
          </Box>
          <Button
            onClick={() => {
              router.push(`/live`);
            }}
          >
            live
          </Button>
          <Button
            onClick={() => {
              router.push(`/leaderboard`);
            }}
          >
            leaderboard
          </Button>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={userImage}>P</Avatar>
            <Typography
              component="h2"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flex: 1 }}
            >
              {userName}
            </Typography>
            <UserMenu />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
