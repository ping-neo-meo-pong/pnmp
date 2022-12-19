import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect } from "react";
import axios from "axios";

function ChangeRoleDialog({ open, onClose, onSelect }: any) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change role</DialogTitle>
      <List>
        {["ADMINISTRATOR", "NORMAL"].map((role) => (
          <ListItemButton key={role} onClick={() => onSelect(role)}>
            <ListItemText primary={role} />
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
}

function RoleButton({
  initialRole,
  myRole,
  channelId,
  targetId,
}: {
  initialRole: string;
  myRole: string;
  channelId: string;
  targetId: string;
}) {
  const [role, setRole] = useState(initialRole);
  const [open, setOpen] = useState(false);

  function changeRole(role: string) {
    setOpen(false);
    console.log(`role: ${role}`);
    axios
      .patch(`/server/api/channel/${channelId}/role/${targetId}`, {
        roleInChannel: role,
      })
      .then((res) => {
        console.log(res.data);
        setRole(role);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <>
      <Button onClick={myRole === "NORMAL" ? () => {} : () => setOpen(true)}>
        {role}
      </Button>
      <ChangeRoleDialog
        open={open}
        onClose={() => setOpen(false)}
        onSelect={changeRole}
      />
    </>
  );
}

function SetTimeDialog({ title, open, onClose, onSelect }) {
  /*
  const choices = [
    {
      setTime: () => {
        const date = new Date;
        return date.setDate(
      }
  ];
  */
  const [time, setTime] = useState(1);

  const handleChange = (event: SelectChangeEvent) => {
    setTime(event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <Select onChange={handleChange} value={time}>
              <MenuItem value={1}>1분</MenuItem>
              <MenuItem value={60}>1 시간</MenuItem>
              <MenuItem value={60 * 24}>One day</MenuItem>
              <MenuItem value={60 * 24 * 7}>One week</MenuItem>
              <MenuItem value={14}>Two weeks</MenuItem>
              <MenuItem value={21}>Three weeks</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSelect(time)}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

function MuteButton({ initialIsMuted, myRole, channelId, targetId }) {
  const [isMuted, setIsMuted] = useState(initialIsMuted);
  const [open, setOpen] = useState(false);

  if (myRole === "NORMAL") {
    return (
      <IconButton>{isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}</IconButton>
    );
  } else {
    return (
      <>
        <IconButton
          onClick={isMuted ? () => setIsMuted(false) : () => setOpen(true)}
        >
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
        <SetTimeDialog
          title="Mute for"
          open={open}
          onClose={() => setOpen(false)}
          onSelect={(time: number) => {
            setOpen(false);
            const dt = new Date();
            dt.setMinutes(dt.getMinutes() + time);
            axios
              .patch(`/server/api/channel/${channelId}/mute/${targetId}`, {
                limitedTime: dt.toJSON(),
              })
              .then((res) => {
                console.log(res.data);
                setIsMuted(!isMuted);
              })
              .catch((e) => {
                console.error(e);
              });
          }}
        />
      </>
    );
  }
}

function BanButton({ myRole, channelId, targetId, onBan }) {
  const [open, setOpen] = useState(false);

  if (myRole === "NORMAL") return <></>;

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <CloseIcon />
      </IconButton>
      <SetTimeDialog
        title="Ban for"
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(time: number) => {
          setOpen(false);
          const dt = new Date();
          dt.setMinutes(dt.getMinutes() + time);
          axios
            .patch(`/server/api/channel/${channelId}/ban/${targetId}`, {
              limitedTime: dt.toJSON(),
            })
            .then((res) => {
              console.log(res.data);
              onBan();
            })
            .catch((e) => {
              console.error(e);
            });
        }}
      />
    </>
  );
}

export default function ChannelMemberList({
  initialMembers,
  myRole,
  channelId,
}: any) {
  const [members, setMembers] = useState(initialMembers);

  useEffect(() => console.count("ChannelMemberList mounted"), []);

  return (
    <>
      <List dense>
        {members.map((member: any) => (
          <ListItem
            key={member.id}
            sx={{ borderTop: 1, borderColor: "divider" }}
          >
            <ListItemText primary={member.username} />
            <RoleButton
              initialRole={member.userRoleInChannel}
              myRole={myRole}
              channelId={channelId}
              targetId={member.id}
            />
            <MuteButton
              initialIsMuted={member.userMute}
              myRole={myRole}
              channelId={channelId}
              targetId={member.id}
            />
            <BanButton
              myRole={myRole}
              channelId={channelId}
              targetId={member.id}
              onBan={() => {
                const newMembers = [...members];
                newMembers.splice(members.indexOf(member), 1);
                setMembers(newMembers);
              }}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}
