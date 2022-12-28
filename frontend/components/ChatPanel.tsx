import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import axios from "axios";
import ChatList from "./ChatList";
import AddChatDialog from "./AddChatDialog";

export default function ChatPanel() {
  const [open, setOpen] = useState<boolean>(false);
  const [chats, setChats] = useState([]);

  useEffect(() => getAndSetChats(), []);

  function getAndSetChats() {
    axios
      .get("/server/api/dm")
      .then((response) => {
        setChats(response.data);
      })
      .catch((error) => {});
  }

  function addNewChat(invitedUserId: string) {
    console.log(`invitedUserId: ${invitedUserId}`);
    axios
      .post(`/server/api/dm/${invitedUserId}`)
      .then((response) => getAndSetChats())
      .catch((error) => {
        alert(error.response.data.message);
      });
    setOpen(false);
  }

  return (
    <Box sx={{ flex: 1, position: "relative" }}>
      <ChatList chats={chats} />
      <Fab
        sx={{ position: "absolute", bottom: 10, right: 10 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>
      <AddChatDialog
        open={open}
        onClose={() => setOpen(false)}
        onSelect={addNewChat}
      />
    </Box>
  );
}
