// import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getLoginUser } from "../lib/login";

export default function ChatList({ chats }: any) {
  const router = useRouter();
  const [loginUser, setLoginUser]: any = useState(null);

  useEffect(() => {
    setLoginUser(getLoginUser());
  }, []);

  if (!loginUser) chats = [];

  return (
    <List>
      {chats.map((chat: any ) => {
        const otherUser =
          loginUser.userId === chat.userId.id
            ? chat.invitedUserId
            : chat.userId;
        return (
          <ListItemButton
            key={chat.id}
            onClick={() => router.push(`/dm/${chat.id}`)}
          >
            <ListItemAvatar>
              <Avatar src={otherUser.profileImage}>P</Avatar>
            </ListItemAvatar>
            <ListItemText primary={otherUser.username} />
          </ListItemButton>
        );
      })}
    </List>
  );
}
