import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect } from 'react';

function ChangeRoleDialog({ open, onClose, onSelect }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change role</DialogTitle>
      <List>
        {["ADMIN", "NORMAL"].map((role) => (
          <ListItemButton key={role} onClick={() => onSelect(role)}>
            <ListItemText primary={role} />
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
}

function RoleButton({ initialRole, myRole }) {
  const [role, setRole] = useState(initialRole);
  const [open, setOpen] = useState(false);

  function changeRole(role: string) {
    setRole(role);
    setOpen(false);
  }

  return (
    <>
      <Button onClick={ myRole === "NORMAL"
        ? () => {}
        : () => setOpen(true)
      }>
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
  const [setTime, setSetTime] = useState();

  const handleChange = (event: SelectChangeEvent) => {
    setSetTime(event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <Select
              onChange={handleChange}
              value={setTime}
            >
              <MenuItem value={1}>One day</MenuItem>
              <MenuItem value={2}>Two days</MenuItem>
              <MenuItem value={3}>Three days</MenuItem>
              <MenuItem value={4}>Four days</MenuItem>
              <MenuItem value={5}>Five days</MenuItem>
              <MenuItem value={6}>Six days</MenuItem>
              <MenuItem value={7}>One week</MenuItem>
              <MenuItem value={14}>Two weeks</MenuItem>
              <MenuItem value={21}>Three weeks</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSelect}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

function MuteButton({ initialIsMuted, myRole }) {
  const [isMuted, setIsMuted] = useState(initialIsMuted);
  const [open, setOpen] = useState(false);

  if (myRole === "NORMAL") {
    return (
      <IconButton>
        { isMuted
          ? <VolumeOffIcon />
          : <VolumeUpIcon />
        }
      </IconButton>
    );
  } else {
    return (
      <>
        <IconButton onClick={ isMuted
          ? () => setIsMuted(false)
          : () => setOpen(true)
        }>
          { isMuted
            ? <VolumeOffIcon />
            : <VolumeUpIcon />
          }
        </IconButton>
        <SetTimeDialog
          title="Mute for"
          open={open}
          onClose={() => setOpen(false)}
          onSelect={() => {
            setIsMuted(!isMuted);
            setOpen(false);
          }}
        />
      </>
    );
  }
}

function BanButton({ myRole }) {
  const [open, setOpen] = useState(false);

  if (myRole === "NORMAL")
    return;

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <CloseIcon />
      </IconButton>
      <SetTimeDialog
        title="Ban for"
        open={open}
        onClose={() => setOpen(false)}
        onSelect={() => setOpen(false)}
      />
    </>
  );
}

export default function ChannelMemberList({ initialMembers, myRole }: any) {
  const [members, setMembers] = useState(initialMembers);

  return (
    <>
      <List dense>
        {members.map((member) => (
          <ListItem key={member.id} sx={{ borderTop: 1, borderColor: "divider"}}>
            <ListItemText primary={member.username} />
            <RoleButton initialRole={member.userRoleInChannel} myRole={myRole}/>
            <MuteButton initialIsMuted={member.userMute} myRole={myRole} />
            <BanButton myRole={myRole} />
          </ListItem>
        ))}
      </List>
    </>
  );
}
