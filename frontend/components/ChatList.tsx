import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/router';

export default function ChatList({ chats }) {
  const router = useRouter();

  return (
    <List>
      {chats.map((chat) => {
        return (
          <ListItemButton
            key={chat.id}
            onClick={() => router.push(`/dm/${chat.id}`)}
          >
            <ListItemAvatar>
              <Avatar>P</Avatar>
            </ListItemAvatar>
            <ListItemText primary={chat.otherUser} />
          </ListItemButton>
        );
      })}
    </List>
  );
}
