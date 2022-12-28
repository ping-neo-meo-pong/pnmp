import { useState, SyntheticEvent } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { bodyHeight } from "./constants";
import ChatPanel from "./ChatPanel";
import ChannelPanel from "./ChannelPanel";
import FriendPanel from "./FriendPanel";

function TabPanel({ children, value, index }: any) {
  return (
    <Box
      sx={{
        flex: 1,
        display: value === index ? "flex" : "none",
        flexDirection: "column",
      }}
    >
      {value === index && (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

export default function RightPanel() {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: bodyHeight,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} variant="fullWidth">
            <Tab label="Chats" />
            <Tab label="Channels" />
            <Tab label="Friends" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <ChatPanel />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ChannelPanel />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <FriendPanel />
        </TabPanel>
      </Box>
    </>
  );
}
