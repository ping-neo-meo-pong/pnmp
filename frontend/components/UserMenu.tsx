import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/router";
import { getLoginUser, logout } from "../lib/login";
import { Menu } from "@mui/material";

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const user = getLoginUser();

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleProfile = () => {
    setAnchorEl(null);
    router.push(`/profile/${user.id}`);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleToggle}>
        <MenuIcon />
      </IconButton>
      <Menu open={open} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <MenuList>
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
