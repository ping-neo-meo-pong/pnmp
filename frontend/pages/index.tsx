import Head from "next/head";
// import styles from '../styles/Home.module.css'
import { useRouter } from "next/dist/client/router";
import { useState, useEffect } from "react";
// import Link from "next/link";
import { isLoggedIn, logout } from "../lib/login";

import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/joy/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// export default function Home() {
//   const router = useRouter();

//   useEffect(() => {
//     router.push(isLoggedIn() ? "/clients" : "/login");
//   });

//   return <></>;
// }

import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react";
import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Image from "next/image";
import Login from "../components/LoginWithAuth";
import { SendTimeExtension, SendTimeExtensionSharp } from "@mui/icons-material";
import { socket, useSocketAuthorization } from "../lib/socket";
import { userAgent } from "next/server";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://localhost">
        ping-neo-meo-pong
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Home() {
  const router = useRouter();
  const { data: session, status: status} = useSession();

  console.log(session);
  console.log(status);
  console.log("count");
  if (session) {
    if (isLoggedIn()) router.push("/clients");
    else {
      axios
        .post("/server/api/auth/login", {
          email: session.user.email,
          accessToken: session.accessToken,
          //   username: session.user.name,
        })
        .then((res) => {
          console.log(`index:`);
          console.log(res.data);
          if (res.data.firstLogin) {
            router.push("/signup");
          } else if (res.data.twoFactorAuth == true) {
            router.push("/2fa");
          } else {
            socket.emit("authorize", res.data.accessToken);
            const loginUser = {
              id: res.data.id,
              username: res.data.username,
              jwt: res.data.accessToken,
            };
            window.localStorage.setItem("loginUser", JSON.stringify(loginUser));
            router.push("/clients");
          }
        })
    }
  }
  return (
    <>
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
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Image src="/pu.svg" alt="home" width={220} height={180} />
          </div>
          <Button
            onClick={() => {
              signIn("github");
            }}
          >
            Sign with GitHub
          </Button>
          <Button
            onClick={() => {
              signIn("42-school");
            }}
          >
            Sign with 42school
          </Button>
        </Sheet>
        <Copyright sx={{ mt: 2, mb: 4 }} />
      </CssVarsProvider>
    </>
  );
}
