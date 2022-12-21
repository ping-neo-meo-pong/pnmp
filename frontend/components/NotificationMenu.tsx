import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/router";
import { getLoginUser, logout } from "../lib/login";
import Notifications from "@mui/icons-material/Notifications";
import { socket } from "../lib/socket";
import { useEffect, useState } from "react";
import axios from "axios";
import { Menu } from "@mui/material";

export default function NotificationMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const user = getLoginUser();
  const open = Boolean(anchorEl);

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  return (
    <>
      <IconButton onClick={handleToggle}>
        <Notifications />
      </IconButton>
      <Menu open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        Friend:
        <MenuList>
          <GetRequestedFriend onClick={() => setAnchorEl(null)} />
          {/* <MenuItem onClick={handleProfile}>Profile</MenuItem> */}
        </MenuList>
        Channel:
        <MenuList>
          <GetInvitedChannel onClick={() => setAnchorEl(null)} />
          {/* <MenuItem onClick={handleLogout}>Logout</MenuItem> */}
        </MenuList>
        Game:
        <MenuList>
          <GetInvitedGame onClick={() => setAnchorEl(null)} />
        </MenuList>
      </Menu>
    </>
  );
}

function GetRequestedFriend({ onClick }) {
  useEffect(() => getAndSetFriends(), []);
  const [friendships, setFriendships]: any[] = useState([]);

  function getAndSetFriends() {
    axios
      .get("/server/api/user/friend")
      .then((response) => {
        setFriendships([
          //   ...response.data.friends,
          ...response.data.receiveRequest,
          //   ...response.data.sendRequest,
        ]);
      })
      .catch((error) => {});
  }
  return friendships.map((friendship: any) => (
    <MenuItem
      key={friendship.id}
      onClick={() => {
        axios
          .patch(`/server/api/user/friend/${friendship.userId.id}`)
          .then((res) => {
            console.log(res.data);
          })
          .catch((e) => {
            console.error(e);
          });
        onClick();
      }}
    >
      {friendship.userId.username}
    </MenuItem>
  ));
}

function GetInvitedChannel({ onClick }) {
  const [invitedChannel, setInvitedChannel]: any[] = useState([]);
  useEffect(() => {
    axios.get(`/server/api/user/channel`).then((res) => {
      const channelList: any[] = [];
      for (const ch of res.data.invite) {
        channelList.push(
          <MenuItem
            key={ch.channelId}
            onClick={() => {
              axios
                .patch(`/server/api/user/channel/${ch.id}`)
                .then((res) => {
                  console.log(res.data);
                })
                .catch((e) => {
                  console.error(e);
                });
              onClick();
            }}
          >
            {ch.channelName}
          </MenuItem>
        );
      }
      setInvitedChannel(channelList);
    });
  }, []);
  return <>{invitedChannel}</>;
}

function GetInvitedGame({ onClick }) {
  const [invitedGameRoom, setInvitedGameRoom]: any[] = useState([]);
  useEffect(() => {
    let newGameRoomList: any[] = [];
    socket.emit("giveMeInvited");
    console.log("GetInvitedGame rendered");
    socket.on(`invitedQue`, (ques) => {
      socket.off(`invitedQue`);
      console.log(`invitedQue!`);
      for (let que of ques) {
        console.log(que);
        newGameRoomList.push(
          <MenuItem
            key={que.inviterId}
            onClick={() => {
              socket.emit("acceptFriendQue", que.inviterId);
              socket.off(`acceptFriendQue`);
              onClick();
            }}
          >
            {que.inviterName} {que.mode}
          </MenuItem>
        );
      }
      setInvitedGameRoom(newGameRoomList);
    });
  }, []);

  return <>{invitedGameRoom}</>;
}
