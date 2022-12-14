import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CheckBox from '@mui/material/CheckBox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useState } from 'react';
import axios from 'axios';

export default function CreateChannelDialog({ open, onClose, onSubmit }) {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  function resetStates() {
    setName('');
    setDescription('');
    setPassword('');
    setIsPrivate(false);
  }

  function submit() {
    axios
      .post(
        "/server/api/channel",
        {
          channelName: name,
          description,
          password,
          isPublic: !isPrivate
        },
      )
      .then((response) => onSubmit())
      .catch((error) => {
      });
    resetStates();
    onClose();
  }

  function close() {
    resetStates();
    onClose();
  }

  return (
    <Dialog open={open} onClose={close} fullWidth>
      <DialogTitle>Create new channel</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Channel name"
          fullWidth
          required
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          margin="dense"
          label="Channel description"
          fullWidth
          multiline
          rows={8}
          onChange={(event) => setDescription(event.target.value)}
        />
        <TextField
          margin="dense"
          label="Channel password"
          fullWidth
          name="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <FormControlLabel
          label="Set private"
          control={<CheckBox onChange={() => {
            console.log('CheckBox onChange');
            setIsPrivate(!isPrivate);
          }} />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button onClick={submit}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
