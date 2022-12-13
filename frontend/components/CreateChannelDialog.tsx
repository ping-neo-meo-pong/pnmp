import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

export default function CreateChannelDialog({ open, onClose }) {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Create new channel</DialogTitle>
    </Dialog>
  );
}
