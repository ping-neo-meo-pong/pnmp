import * as React from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import { logout } from '../lib/login';

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    router.push("/login");
  }

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleToggle}
      >
        <MenuIcon />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
      >
        <Paper>
          <MenuList
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Paper>
      </Popper>
    </>
  );
}
