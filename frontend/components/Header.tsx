import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';

export default function Header({ title }) {
  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
      </Toolbar>
      <Grid container spacing={2} sx={{ py: 2 }}>
        <Grid item xs={12} md={9} sx={{ display: "flex" }}>
          <Box sx={{ display: "inline", flex: 1 }}>
            <Button variant="contained">find match</Button>
          </Box>
          <Button>live</Button>
          <Button>leaderboard</Button>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar>P</Avatar>
            <Typography
              component="h2"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flex: 1 }}
            >
              User
            </Typography>
            <IconButton>
              <MenuIcon />
            </IconButton>
          </Stack>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
