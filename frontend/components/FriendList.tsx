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

        return (
          <ListItemButton
            key={friendship.id}
            onClick={() => {
              router.push(`/profile/${friend.id}`);
            }}
          >
            <ListItemAvatar>
              <Tooltip title={friend.status} placement="left">
                <Badge
                  sx={{
                    py: 0.2,
                    px: 0.2,
                    margin: 0,
                    border: 3,
                    borderRadius: 50,
                    color:
                      friend.status === "ONLINE"
                        ? "lime"
                        : friend.status === "INGAME"
                        ? "orange"
                        : "grey",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                  variant="dot"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                >
                  <Avatar src={friend.profileImage} />
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
