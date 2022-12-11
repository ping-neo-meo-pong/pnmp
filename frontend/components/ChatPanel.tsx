import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function ChatPanel() {
  return (
    <>
      <Box sx={{ flex: 1 }}>
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
    </>
  );
}
