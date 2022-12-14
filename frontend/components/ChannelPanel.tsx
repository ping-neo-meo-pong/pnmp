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
import PasswordDialog from './PasswordDialog';

export default function ChannelPanel() {
  const [joinDialogOpen, setJoinDialogOpen] = useState<boolean>(false);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channels, setChannels] = useState([]);

  useEffect(() => getAndSetChannels(), []);

  function getAndSetChannels() {
    axios
      .get('/server/api/user/channel')
      .then((response) => {
        setChannels(response.data.channels);
      })
      .catch((error) => {
      })
  }

  function joinChannelWithPassword(password: string) {
    axios
      .post(
        `/server/api/channel/${selectedChannel.id}`,
        { password }
      ).
      then((response) => getAndSetChannels())
      .catch((error) => {
        alert(error.response.data.message);
      });
    setPasswordDialogOpen(false);
  }

  function onSelectChannelToJoin(channel) {
    setSelectedChannel(channel);
    setJoinDialogOpen(false);
    setPasswordDialogOpen(true);
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
        onSelect={onSelectChannelToJoin}
        onCreateNew={openCreateDialog}
      />
      <PasswordDialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        onSubmit={joinChannelWithPassword}
      />
      <CreateChannelDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={getAndSetChannels}
      />
    </Box>
  );
}
