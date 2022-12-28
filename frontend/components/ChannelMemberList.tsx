import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import AddIcon from "@mui/icons-material/Add";
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
import { getLoginUser } from "../lib/login";
import { FiberNew } from "@mui/icons-material";
import { Router, useRouter } from "next/router";
import { Avatar, ListItemAvatar } from "@mui/material";
import { socket } from "../lib/socket";

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
              <MenuItem value={60 * 24}>하루</MenuItem>
              <MenuItem value={60 * 24 * 7}>일주일</MenuItem>
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

function MuteButton({ initialIsMuted, channelId, targetId }: any) {
  const [isMuted, setIsMuted] = useState(initialIsMuted);
  const [open, setOpen] = useState(false);

  //   if (isIf == 1 || isIf == 2) {
  //     return (
  //       <IconButton>{isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}</IconButton>
  //     );
  //   } else {
  return (
    <>
      <IconButton
        onClick={
          isMuted
            ? () => {
                const dt = new Date();
                axios
                  .patch(`/server/api/channel/${channelId}/mute/${targetId}`, {
                    limitedTime: dt.toJSON(),
                  })
                  .then((res) => {
                    console.log(res.data);
                    setIsMuted(false);
                  })
                  .catch((e) => {
                    console.error(e);
                  });
              }
            : () => {
                setOpen(true);
              }
        }
      >
        {isMuted ? (
          <VolumeOffIcon color="primary" />
        ) : (
          <VolumeUpIcon color="primary" />
        )}
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

function BanButton({ channelId, targetId, onBan }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen(true)} color="primary">
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

function OutButton({ channelId }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <IconButton onClick={() => setOpen(true)} color="primary">
        <ExitToAppIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>나가시겠습니까?</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              axios
                .patch(`/server/api/channel/${channelId}`)
                .then((res) => {
                  console.log(res.data);
                  router.push(`/clients`);
                })
                .catch((e) => {
                  console.error(e);
                });
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function ChannelMemberList({
  initialMembers,
  myRole,
  channelId,
}: any) {
  const [members, setMembers] = useState(initialMembers);
  const me = getLoginUser();
  const router = useRouter();

  useEffect(() => console.count("ChannelMemberList mounted"), []);

  return (
    <>
      <List dense>
        {members.map((member: any) => (
          <ListItem
            key={member.id}
            sx={{ borderTop: 1, borderColor: "divider" }}
          >
            <ListItemText
              onClick={() => {
                router.push(`/profile/${member.id}`);
              }}
              primary={member.username}
            />
            <RoleButton
              initialRole={member.userRoleInChannel}
              myRole={myRole}
              channelId={channelId}
              targetId={member.id}
            />
            {myRole == "NORMAL" ||
            me.id == member.id ||
            member.userRoleInChannel == "OWNER" ? (
              <IconButton>
                <VolumeOffIcon />
              </IconButton>
            ) : (
              <MuteButton
                initialIsMuted={member.userMute}
                channelId={channelId}
                targetId={member.id}
              />
            )}
            {me.id == member.id ? (
              <OutButton channelId={channelId} />
            ) : myRole == "NORMAL" || member.userRoleInChannel == "OWNER" ? (
              <IconButton
                onClick={() => {
                  socket.emit("leaveRoom", channelId);
                }}
              >
                <CloseIcon />
              </IconButton>
            ) : (
              <BanButton
                channelId={channelId}
                targetId={member.id}
                onBan={() => {
                  const newMembers = [...members];
                  newMembers.splice(members.indexOf(member), 1);
                  setMembers(newMembers);
                  socket.emit("userBan", {
                    targetId: member.id,
                    roomId: channelId,
                  });
                }}
              />
            )}
            {/* <IconButton color="primary">
              <ExitToAppIcon></ExitToAppIcon>
            </IconButton> */}
          </ListItem>
        ))}
      </List>
    </>
  );
}
