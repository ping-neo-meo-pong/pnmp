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
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  sections: ReadonlyArray<{
    title: string;
    url: string;
  }>;
  title: string;
}

export default function Header(props: HeaderProps) {
  const { sections, title } = props;

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
      <Grid container>
        <Grid item xs={8}>
          <Grid container>
            <Grid item xs={2}>
              <Button variant="contained">Find match</Button>
            </Grid>
            <Grid item xs={10}>
              <Grid container direction="row-reverse">
                <Button>leaderboard</Button>
                <Button>live</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Stack direction="row" spacing={2}>
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
            <MenuIcon />
          </Stack>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
