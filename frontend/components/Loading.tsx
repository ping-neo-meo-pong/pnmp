import { socket } from "../lib/socket";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { Button, Modal, Box, ToggleButtonGroup, ToggleButton, Typography, TextField, Fade } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import CallSplitIcon from '@mui/icons-material/CallSplit';

export function GameRoading() {
    const [finding, setfinding] = useState(false);
    const [query, setQuery] = useState('idle');
    const timerRef = useRef<number>();
  
    useEffect(
      () => () => {
        clearTimeout(timerRef.current);
      },
      [],
    );
  
    const handleClickfinding = () => {
      setfinding((prevfinding) => !prevfinding);
    };
  
    const handleClickQuery = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
  
      if (query !== 'idle') {
        setQuery('idle');
        return;
      }
  
      setQuery('progress');
      timerRef.current = window.setTimeout(() => {
        setQuery('success');
      }, 2000);
    };
  
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ height: 40 }}>
          <Fade
            in={finding}
            style={{
              transitionDelay: finding ? '800ms' : '0ms',
            }}
            unmountOnExit
          >
            <CircularProgress />
          </Fade>
        </Box>
        <Button onClick={handleClickfinding} sx={{ m: 2 }}>
          {finding ? 'Stop finding' : 'finding'}
        </Button>
      </Box>
    );
  }