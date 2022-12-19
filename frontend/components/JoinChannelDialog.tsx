import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import axios from "axios";

export default function JoinChannelDialog({
  open,
  onClose,
  onSelect,
  onCreateNew,
}: any) {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    axios
      .get("/server/api/channel")
      .then(function (response) {
        setChannels(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [open]);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Join new channel</DialogTitle>
      <List sx={{ pt: 0 }}>
        {channels.map((channel: any) => (
          <ListItemButton onClick={() => onSelect(channel)} key={channel.id}>
            <ListItemText primary={channel.channelName} />
          </ListItemButton>
        ))}
        <ListItemButton onClick={onCreateNew}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Create new channel" />
        </ListItemButton>
      </List>
    </Dialog>
  );
}
