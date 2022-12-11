import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './UserList';

export default function ChatPanel() {
  const [users, setUsers] = useState([]);
  const [dmRoomList, setDmRoomList] = useState([]);

  useEffect(() => {
    axios
      .get('/server/api/user')
      .then(function (response) {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("/server/api/dm")
      .then(function (response) {
        user_data._room = response.data;
        const newDmRoomList = response.data;
        setDmRoomList(newDmRoomList);
        // dmSocket.emit("dmRooms", newDmRoomList);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Box sx={{ flex: 1 }}>
        <UserList />
      </Box>
      <Box sx={{ display: "flex", borderTop: 1, borderColor: 'divider' }}>
        <Autocomplete
          sx={{ flex: 1, ml: 1 }} 
          freeSolo
          options={users.map((e) => e.username)}
          renderInput={
            (params) => {
              const { InputLabelProps, InputProps, ...rest } = params;
              return <InputBase {...params.InputProps} {...rest} />;
            }
          }
        />
        <IconButton type="button" sx={{ p: '5px' }}>
          <AddIcon />
        </IconButton>
      </Box>
    </>
  );
}
