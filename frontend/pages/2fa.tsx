import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import Typography from "@mui/joy/Typography";
import TextField from "@mui/joy/TextField";
import Sheet from "@mui/joy/Sheet";
import Link from "@mui/joy/Link";
import FormControl from "@mui/joy/FormControl";
import Button from "@mui/joy/Button";
import Avatar from "@mui/joy/Avatar";
import { CssVarsProvider } from "@mui/joy/styles";
import axios from "axios";
function Copyright(props: any) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link href="https://localhost">ping-neo-meo-pong</Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

export default function TwoFactorAuthentificator() {
  const [code, setCode] = useState("");

  const handleSubmit = async () => {
    // const body = new FormData();
    // body.append("file", image);
    // axios
    //   .post(`/server/api/2fa?${code}`, {
    //     method: "POST",
    //     body,
    //   })
    //   .then((res) => {})
  };

    return (
        <CssVarsProvider>
          <FormControl>
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
          <Image src="/pu.svg" alt="home" width={220} height={180} />
          <Typography level="h4"> One Time Password</Typography>
          <TextField
            value={code}
            placeholder="Code"
            required
            sx={{ width: 300 }}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            onClick={() => {
              handleSubmit();
            }}
            sx={{ width: 300 }}
          >
            Send
          </Button>
        </Sheet>
        </FormControl>
        <Copyright sx={{ mt: 2, mb: 4 }} />
      </CssVarsProvider>
    );
}