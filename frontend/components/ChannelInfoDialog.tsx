import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getLoginUser } from '../lib/login';
import ChannelMemberList from './ChannelMemberList';

export default function ChannelInfoDialog({ channel, open, onClose }: any) {
  const [members, setMembers] = useState([]);
  const [me, setMe] = useState(null);

  console.log('members in ChannelInfoDialog');
  console.log(members);

  useEffect(() => {
    const loginUser = getLoginUser();

    axios
      .get(`/server/api/channel/${channel.id}/member`)
      .then((response) => {
        const members = response.data;
        setMembers(members);
        setMe(members.find((member) => member.id === loginUser.id));
      })
      .catch((error) => {
      });
  }, [channel]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Name</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {channel.channelName}
        </DialogContentText>
      </DialogContent>
      <DialogTitle>Description</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {channel.description}
        </DialogContentText>
      </DialogContent>
      { me && me.userRoleInChannel === "OWNER" && (
        <>
          <DialogTitle>Change password</DialogTitle>
          <DialogContent>
            <TextField
              label="New password"
              fullWidth
            />
            <Grid container justifyContent="flex-end" sx={{ mt: 1 }}>
              <Button variant="outlined">save</Button>
            </Grid>
          </DialogContent>
        </>
      )}
      <DialogTitle>Members</DialogTitle>
      <DialogContent>
        { me && (
          <ChannelMemberList
            initialMembers={members}
            myRole={me.userRoleInChannel}
            channelId={channel.id}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
