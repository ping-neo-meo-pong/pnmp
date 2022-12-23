import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import axios from "axios";
import FriendList from "./FriendList";
import AddFriendDialog from "./AddFriendDialog";

export default function FriendPanel() {
  const [open, setOpen] = useState<boolean>(false);
  const [friendships, setFriendships]: any[] = useState([]);

  useEffect(() => getAndSetFriends(), []);

  function getAndSetFriends() {
    axios
      .get("/server/api/user/friend")
      .then((response) => {
        setFriendships([...response.data.friends]);
      })
      .catch((error) => {});
  }

  function friendRequest(friendId: string) {
    axios
      .post(`/server/api/user/friend/${friendId}`)
      .then((response) => getAndSetFriends())
      .catch((error) => {
        alert(error.response.data.message);
      });
    setOpen(false);
  }

  return (
    <Box sx={{ flex: 1, position: "relative" }}>
      <FriendList friendships={friendships} />
      <Fab
        sx={{ position: "absolute", bottom: 10, right: 10 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>
      <AddFriendDialog
        open={open}
        onClose={() => setOpen(false)}
        onSelect={friendRequest}
      />
    </Box>
  );
}
