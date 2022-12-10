import { useState, SyntheticEvent } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { bodyHeight } from './constants';

function TabPanel({ children, value, index }) {
  return (
    <div
      hidden={value !== index}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function RightPanel() {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: bodyHeight }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} variant="fullWidth">
            <Tab label="Chats" />
            <Tab label="Channels" />
            <Tab label="Friends" />
          </Tabs>
        </Box>
        <Box sx={{ flex: 1 }}>
          <TabPanel value={value} index={0}>
            chats...
          </TabPanel>
          <TabPanel value={value} index={1}>
            channels...
          </TabPanel>
          <TabPanel value={value} index={2}>
            friends...
          </TabPanel>
        </Box>
        <Box sx={{ display: "flex", borderTop: 1, borderColor: 'divider' }}>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
          />
          <IconButton type="button" sx={{ p: '10px' }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
