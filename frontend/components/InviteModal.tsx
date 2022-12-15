import { socket } from "../lib/socket";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  Modal,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  TextField,
  Fade,
} from "@mui/material";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import CircularProgress from "@mui/material/CircularProgress";

/////// InviteModal, InviteModalWithUserName({ userName }) //////////

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export function InviteModal() {
  ///////////////////////////////////////////////////////////
  const [open, setOpen] = useState(false);
  const [finding, setFinding] = useState(false);
  const [query, setQuery] = useState("idle");
  const timerRef = useRef<number>();

  const handleClose = () => {
    if (finding == true) {
      console.log(`cencel matching`);
      socket.emit(`cencelMatching`);
      setFinding(false);
    }
    setOpen(false);
  };

  const [alignment, setAlignment] = useState<string>("NORMAL");
  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    if (newAlignment != null) setAlignment(newAlignment);
  };

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    []
  );

  function onSubmitGameInvite(event: React.FormEvent<HTMLFormElement>) {
    console.log(`cookie: ${document.cookie}`);
    console.log(event.currentTarget.userName.value);
    console.log(finding);
    event.preventDefault(); // ?
    setFinding((prevfinding) => !prevfinding);
    if (finding == false) {
      if (event.currentTarget.userName.value) {
        socket.emit(`gameToFriend`, {
          invitedUserName: event.currentTarget.userName.value,
          // invitedUserName: "jw",
          mode: alignment,
        });
        socket.off(`gameToFriend`);
        // router.push(`/matching`);
      } else {
        alert(`please input name`);
      }
    }
  }

  const handleClickfinding = () => {
    setFinding((prevfinding) => !prevfinding);
  };
  function GameLoading() {
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
      </Box>
    );
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => {
          setOpen(true);
        }}
      >
        {" "}
        게임 초대{" "}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          component="form"
          noValidate
          onSubmit={onSubmitGameInvite}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Invite User!
          </Typography>

          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
          >
            <ToggleButton value="NORMAL" aria-label="NORMAL">
              NORMAL <BubbleChartIcon />
            </ToggleButton>
            <ToggleButton value="HARD" aria-label="HARD">
              HARD <CallSplitIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          {alignment}
          <br />
          <br />
          <TextField
            id="userName"
            name="userName"
            fullWidth
            label="userName"
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
          ></TextField>
          <Button
            type="submit"
            onClick={() => {
              if (finding == true) {
                console.log(`cencel matching`);
                socket.emit(`cencelMatching`);
              }
            }}
            fullWidth
            variant="contained"
          >
            {finding ? "Stop finding" : "finding"}
          </Button>
          <br />
          <br />
          <GameLoading />
        </Box>
      </Modal>
    </div>
  );
}

export function InviteModalWithUserName({ userName }: any) {
  ///////////////////////////////////////////////////////////
  const [open, setOpen] = useState(false);
  const [finding, setFinding] = useState(false);
  const timerRef = useRef<number>();

  const handleClose = () => {
    if (finding == true) {
      console.log(`cencel matching`);
      socket.emit(`cencelMatching`);
      setFinding(false);
    }
    setOpen(false);
  };
  const [alignment, setAlignment] = useState<string>("NORMAL");
  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    if (newAlignment != null) setAlignment(newAlignment);
  };

  function onClickGameInvite() {
    console.log(`cookie: ${document.cookie}`);
    console.log(userName);
    setFinding((prevfinding) => !prevfinding);
    if (finding == false) {
      if (userName) {
        socket.emit(`gameToFriend`, {
          invitedUserName: userName,
          // invitedUserName: "jw",
          mode: alignment,
        });
        socket.off(`gameToFriend`);
        // router.push(`/matching`);
      } else {
        alert(`please input name`);
      }
    }
  }
  function GameLoading() {
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
      </Box>
    );
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => {
          setOpen(true);
        }}
      >
        {" "}
        {userName}에게 게임 초대{" "}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Invite User!
          </Typography>

          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
          >
            <ToggleButton value="NORMAL" aria-label="NORMAL">
              NORMAL <BubbleChartIcon />
            </ToggleButton>
            <ToggleButton value="HARD" aria-label="HARD">
              HARD <CallSplitIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          {alignment}
          <br />
          <br />
          <Button
            onClick={() => {
              onClickGameInvite();
              if (finding == true) {
                console.log(`cencel matching`);
                socket.emit(`cencelMatching`);
              }
            }}
            fullWidth
            variant="contained"
          >
            {finding ? "Stop finding" : "finding"}
          </Button>
          <br />
          <br />
          <GameLoading />
        </Box>
      </Modal>
    </div>
  );
}

export function MatchingModal() {
  ///////////////////////////////////////////////////////////
  const [open, setOpen] = useState(false);
  const [finding, setFinding] = useState(false);
  const timerRef = useRef<number>();
  const router = useRouter();

  socket.on("goToGameRoom", (roomId) => {
    // user_data.is_player = 1;
    router.push(`/game/${roomId}`);
  });

  const handleClose = () => {
    if (finding == true) {
      console.log(`cencel matching`);
      socket.emit(`cencelMatching`);
      setFinding(false);
    }
    setOpen(false);
  };
  const [alignment, setAlignment] = useState<string>("NORMAL");
  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    if (newAlignment != null) setAlignment(newAlignment);
  };

  function onClickMatching() {
    console.log(`cookie: ${document.cookie}`);
    setFinding((prevfinding) => !prevfinding);
    if (finding == false) {
      socket.emit("gameMatching", alignment);
    }
  }
  function GameLoading() {
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
      </Box>
    );
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => {
          setOpen(true);
        }}
      >
        {" "}
        Find Match{" "}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Invite User!
          </Typography>

          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
          >
            <ToggleButton value="NORMAL" aria-label="NORMAL">
              NORMAL <BubbleChartIcon />
            </ToggleButton>
            <ToggleButton value="HARD" aria-label="HARD">
              HARD <CallSplitIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          {alignment}
          <br />
          <br />
          <Button
            onClick={() => {
              onClickMatching();
              if (finding == true) {
                console.log(`cencel matching`);
                socket.emit(`cencelMatching`);
              }
            }}
            fullWidth
            variant="contained"
          >
            {finding ? "Stop finding" : "finding"}
          </Button>
          <br />
          <br />
          <GameLoading />
        </Box>
      </Modal>
    </div>
  );
}
