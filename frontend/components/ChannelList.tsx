import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/router';

export default function ChannelList({ channels }) {
  const router = useRouter();

  return (
    <List>
      {channels.map((channel) => {
        return (
          <ListItemButton
            key={channel.id}
          >
            <ListItemAvatar>
              <Avatar>P</Avatar>
            </ListItemAvatar>
            <ListItemText primary={channel.name} />
          </ListItemButton>
        );
      })}
    </List>
  );
}
