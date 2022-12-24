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
import { regex } from "../lib/regex";

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

export default function SignUp() {
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [image, setImage] = useState(null);
  const [userName, setUserName] = useState("");

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];

      setImage(img);
      setCreateObjectURL(URL.createObjectURL(img));
    }
    console.log("I'm Here");
  };

  const handleSubmit = async () => {
    if (regex(userName, 10)) {
      close();
      alert("잘못된 이름입니다");
      return;
    }
    const body = new FormData();
    body.append("file", image);
    axios
      .post(`/server/api/file?${userName.trim()}`, {
        method: "POST",
        body,
      })
      .then((res) => {})
      .catch((e) => {});
  };

  return (
    <CssVarsProvider>
      {/* <FormControl onSubmit={handleSubmit}> */}
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
          <Avatar
            src={createObjectURL}
            size="lg"
            sx={{
              width: 180,
              height: 180,
              mt: "lg",
              mx: "auto", // margin left & right
              display: "flex",
              flexDirection: "column",
              boxShadow: "sm",
              alignItems: "center",
            }}
          />
          <Button variant="plain" component="label">
            Change Profile Image
            <input
              hidden
              type="file"
              name="myImage"
              onChange={uploadToClient}
            />
          </Button>
          <TextField
            value={userName}
            placeholder="Username"
            sx={{ width: 300 }}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Button
            onClick={() => {
              handleSubmit();
            }}
            sx={{ width: 300 }}
          >
            Sign Up
          </Button>
        </Sheet>
      </FormControl>
      <Copyright sx={{ mt: 2, mb: 4 }} />
    </CssVarsProvider>
  );
}
