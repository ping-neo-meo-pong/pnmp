import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AddChatDialog({ open, onClose, onSelect }: any) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("/server/api/user")
      .then(function (response) {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Add new chat</DialogTitle>
      <List sx={{ pt: 0 }}>
        {users.map((user: any) => (
          <ListItemButton onClick={() => onSelect(user.id)} key={user.id}>
            <ListItemText primary={user.username} />
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
}
