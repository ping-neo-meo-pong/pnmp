import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getLoginUser } from "../lib/login";

export default function FriendList({ friendships }: any) {
  const router = useRouter();
  const [loginUser, setLoginUser]: any = useState(null);

  useEffect(() => {
    setLoginUser(getLoginUser());
  }, []);

  if (!loginUser) friendships = [];

  return (
    <List>
      {friendships.map((friendship: any) => {
        const friend =
          loginUser.userId === friendship.userId.id
            ? friendship.userFriendId
            : friendship.userId;

        return (
          <ListItemButton
            key={friendship.id}
            onClick={() => {
              router.push(`/profile/${friend.username}`);
            }}
          >
            <ListItemAvatar>
              <Avatar src={friend.profileImage}>P</Avatar>
            </ListItemAvatar>
            <ListItemText primary={friend.username} />
          </ListItemButton>
        );
      })}
    </List>
  );
}
