import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ChannelList from './ChannelList';
import JoinChannelDialog from './JoinChannelDialog';
import CreateChannelDialog from './CreateChannelDialog';

export default function ChannelPanel() {
  const [joinDialogOpen, setJoinDialogOpen] = useState<boolean>(false);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [channels, setChannels] = useState([]);

  useEffect(() => getAndSetChannels(), []);

  function getAndSetChannels() {
    axios
      .get('/server/api/user/channel')
      .then((response) => {
        setChannels(response.data);
      })
      .catch((error) => {
      })
  }

  function joinChannel(channelId: string) {
    axios
      .post(`/server/api/channel/${channelId}`).
      then((response) => getAndSetChannels())
      .catch((error) => {
        alert(error.response.data.message);
      });
    setJoinDialogOpen(false);
  }

  function openCreateDialog() {
    setJoinDialogOpen(false);
    setCreateDialogOpen(true);
  }

  return (
    <Box sx={{ flex: 1, position: "relative" }}>
      <ChannelList channels={channels}/>
      <Fab
        sx={{ position: "absolute", bottom: 10, right: 10 }}
        onClick={() => setJoinDialogOpen(true)}
      >
        <AddIcon />
      </Fab>
      <JoinChannelDialog
        open={joinDialogOpen}
        onClose={() => setJoinDialogOpen(false)}
        onSelect={joinChannel}
        onCreateNew={openCreateDialog}
      />
      <CreateChannelDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </Box>
  );
}
