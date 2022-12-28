import { useState, useEffect, useRef } from "react";
import { Button, Box, Fade } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export function GameRoading() {
  const [finding, setfinding] = useState(false);
  const [query, setQuery] = useState("idle");
  const timerRef = useRef<number>();

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    []
  );

  const handleClickfinding = () => {
    setfinding((prevfinding) => !prevfinding);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box sx={{ height: 40 }}>
        <Fade
          in={finding}
          style={{
            transitionDelay: finding ? "800ms" : "0ms",
          }}
          unmountOnExit
        >
          <CircularProgress />
        </Fade>
      </Box>
      <Button onClick={handleClickfinding} sx={{ m: 2 }}>
        {finding ? "Stop finding" : "finding"}
      </Button>
    </Box>
  );
}
