import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import RightPanel from './RightPanel';
import { bodyHeight } from './constants';

export default function Body({ children }) {
  return (
    <Grid container>
      <Grid xs={9}>
        <Box sx={{
          border: 1,
          borderColor: 'divider',
          height: bodyHeight,
          overflowY: "scroll",
        }}>
          { children }
        </Box>
      </Grid>
      <Grid xs={3}>
        <Box sx={{
          border: 1,
          borderColor: 'divider',
          height: bodyHeight,
        }}>
          <RightPanel />
        </Box>
      </Grid>
    </Grid>
  );
}
