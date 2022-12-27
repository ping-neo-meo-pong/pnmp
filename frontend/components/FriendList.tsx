import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getLoginUser } from "../lib/login";
import { Badge, Tooltip } from "@mui/material";

export default function FriendList({ friendships }: any) {
  const router = useRouter();
  const [loginUser, setLoginUser]: any = useState(null);
  const [userStatus, setUserStatus] = useState("OFFLINE");

  useEffect(() => {
    setLoginUser(getLoginUser());
  }, []);

  if (!loginUser) friendships = [];

  return (
    <List>
      {friendships.map((friendship: any) => {
        console.log(
          `friendList: ${loginUser.username} vs ${friendship.userId.username}`
        );
        const friend =
          loginUser.id === friendship.userId.id
            ? friendship.userFriendId
            : friendship.userId;

        console.log("friend:");
        console.log(friend);

        return (
          <ListItemButton
            key={friendship.id}
            onClick={() => {
              router.push(`/profile/${friend.username}`);
            }}
          >
            <ListItemAvatar>
              <Tooltip title={friend.status} placement="left">
                <Badge
                  color={
                    friend.status === "ONLINE"
                      ? "success"
                      : friend.status === "INGAME"
                      ? "secondary"
                      : "error"
                  }
                  variant="dot"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                >
                  <Avatar src={friend.profileImage}>P</Avatar>
                </Badge>
              </Tooltip>
            </ListItemAvatar>
            <ListItemText primary={friend.username} />
          </ListItemButton>
        );
      })}
    </List>
  );
}
