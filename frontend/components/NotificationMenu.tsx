import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import IconButton from "@mui/material/IconButton";
import Notifications from "@mui/icons-material/Notifications";
import { socket } from "../lib/socket";
import { useEffect, useState } from "react";
import axios from "axios";
import { Menu } from "@mui/material";

export default function NotificationMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

function GetRequestedFriend({ onClick }: any) {
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
      .catch((e) => {
        console.error(e);
      });
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

function GetInvitedChannel({ onClick }: any) {
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

function GetInvitedGame({ onClick }: any) {
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
