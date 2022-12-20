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
import { useState } from "react";

export default function NotificationMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const user = getLoginUser();
  const [invitedGameRoom, setInvitedGameRoom]: any[] = useState([]);

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleProfile = () => {
    setAnchorEl(null);
    router.push(`/profile/${user.username}`);
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    router.push("/login");
  };

  const open = Boolean(anchorEl);

  function GetInvitedGame() {
    let newGameRoomList: any[] = [];
    socket.emit("giveMeInvited");
    socket.on(`invitedQue`, (ques) => {
      for (let que of ques) {
        newGameRoomList.push(
          <MenuItem
            key={que.inviterId}
            onClick={() => {
              socket.emit("acceptFriendQue", que.inviterId);
              socket.off(`acceptFriendQue`);
            }}
          >
            {que.inviterName}
          </MenuItem>
        );
      }
      setInvitedGameRoom(newGameRoomList);
    });

    return <>{newGameRoomList}</>;
  }

  return (
    <>
      <IconButton onClick={handleToggle}>
        <Notifications />
      </IconButton>
      <Popper open={open} anchorEl={anchorEl} placement="bottom-end">
        <Paper>
          Friend
          <MenuList>
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
          </MenuList>
          Channel
          <MenuList>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
          Game
          <MenuList>
            <GetInvitedGame />
            {/* <MenuItem onClick={handleLogout}>Logout</MenuItem> */}
          </MenuList>
        </Paper>
      </Popper>
    </>
  );
}
