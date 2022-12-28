import { useEffect, useState } from "react";
import Typography from "@mui/joy/Typography";
import TextField from "@mui/joy/TextField";
import Sheet from "@mui/joy/Sheet";
import Button from "@mui/joy/Button";
import { CssVarsProvider } from "@mui/joy/styles";
import axios from "axios";
import { Box } from "@mui/system";
import { socket } from "../lib/socket";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function TwoFactorAuthentificator() {
  const router = useRouter();
  const [inputCode, setInputCode] = useState("");
  const { data: session } = useSession();

  return (
    <Box>
      <CssVarsProvider>
        <Sheet
          variant="outlined"
          sx={{
            width: 300,
            mx: "auto", // margin left & right
            my: 4, // margin top & botom
            py: 3, // padding top & bottom
            px: 2, // padding left & right
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: "sm",
            boxShadow: "md",
            alignItems: "center",
          }}
        >
          <Typography level="h4"> One Time Password</Typography>
          <TextField
            value={inputCode}
            placeholder="Code"
            required
            sx={{ width: 300 }}
            onChange={(e) => setInputCode(e.target.value)}
          />
          {/* //////////////// QRCODE //////////////// */}

          <Button
            variant="outlined"
            onClick={() => {
              //////////////////////   2FA Code   //////////////////////
              if (!session) return;
              axios
                .post(
                  `/server/api/auth/otp-login?email=${session.user.email}`,
                  {
                    otp: inputCode,
                  }
                )
                .then((res) => {
                  console.log(res.data);
                  socket.emit("authorize", res.data.accessToken);
                  const loginUser = {
                    id: res.data.id,
                    username: res.data.username,
                    jwt: res.data.accessToken,
                  };
                  window.localStorage.setItem(
                    "loginUser",
                    JSON.stringify(loginUser)
                  );
                  router.push("/clients");
                })
                .catch((e) => {
                  console.error(e);
                });
            }}
          >
            인증하기
          </Button>
        </Sheet>
      </CssVarsProvider>
    </Box>
  );
}
