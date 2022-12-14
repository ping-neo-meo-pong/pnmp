import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useState } from 'react';

export default function PasswordDialog({ open, onClose, onSubmit }) {
  const [password, setPassword] = useState('');

  function close() {
    setPassword('');
    onClose();
  }

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>
        Enter password
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="password"
          fullWidth
          variant="standard"
          onChange={(event) => setPassword(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button onClick={() => onSubmit(password)}>Enter</Button>
      </DialogActions>
    </Dialog>
  );
}
