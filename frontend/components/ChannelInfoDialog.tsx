import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import axios from "axios";
import { getLoginUser } from "../lib/login";
import ChannelMemberList from "./ChannelMemberList";
import InviteMemberDialog from "./InviteMemberDialog";

export default function ChannelInfoDialog({ channel, open, onClose }: any) {
  const [members, setMembers] = useState([]);
  const [me, setMe]: any = useState(null);
  const [password, setPassword] = useState<string>("");
  const [inviteOpen, setInviteOpen] = useState(false);

  console.log("members in ChannelInfoDialog");
  console.log(members);

  useEffect(() => {
    const loginUser = getLoginUser();
    console.count("ChannleInfoDialog mounted");

    axios
      .get(`/server/api/channel/${channel.id}/member`)
      .then((response) => {
        const members = response.data;
        console.log("members");
        console.log(members);
        setMembers(members);
        setMe(members.find((member: any) => member.id === loginUser.id));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [channel, open]);

  function inviteUser(invitedUserId: string) {
    console.log(`invitedUserId: ${invitedUserId}`);
    axios
      .post(`/server/api/channel/${channel.id}/invite/${invitedUserId}`)
      .then((response) => console.log(response.data))
      .catch((error) => {
        alert(error.response.data.message);
      });
    setInviteOpen(false);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Name</DialogTitle>
      <DialogContent>
        <DialogContentText>{channel.channelName}</DialogContentText>
      </DialogContent>
      <DialogTitle>Description</DialogTitle>
      <DialogContent>
        <DialogContentText>{channel.description}</DialogContentText>
      </DialogContent>
      {me && me.userRoleInChannel === "OWNER" && (
        <>
          <DialogTitle>Change password</DialogTitle>
          <DialogContent>
            <TextField
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              label="New password"
              fullWidth
            />
            <Grid container justifyContent="flex-end" sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  axios
                    .patch(`/server/api/channel/${channel.id}/password`, {
                      password: password,
                    })
                    .then((res) => {
                      setPassword("");
                      console.log(res.data);
                    })
                    .catch((e) => {
                      setPassword("");
                      console.log(e);
                    });
                }}
              >
                save
              </Button>
            </Grid>
          </DialogContent>
        </>
      )}
      <DialogTitle>Members</DialogTitle>
      <Button onClick={() => setInviteOpen(true)}>초대하기</Button>
      <InviteMemberDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSelect={inviteUser}
      />
      <DialogContent>
        {me && (
          <ChannelMemberList
            setMembers={setMembers}
            members={members}
            myRole={me.userRoleInChannel}
            channelId={channel.id}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
