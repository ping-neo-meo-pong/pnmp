import Head from "next/head";
import Image from "next/image";
// import styles from '../styles/Home.module.css'
import React, { FormEvent, SyntheticEvent } from "react";
import { useRouter } from "next/dist/client/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { socket } from "../lib/socket";
import { isLoggedIn } from "../lib/login";
import { Box, FormControl, TextField, Typography } from "@mui/material";
import { CssVarsProvider } from '@mui/joy/styles';
import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import { useSession, signIn, signOut } from "next-auth/react"

let user_data: any = {
  _name: "",
  _pass: "",
  _socket: "",
  _token: "",
  _room: [],
};

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://localhost">
        ping-neo-meo-pong
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Login() {
  return (
    <>
       <CssVarsProvider>
        <Sheet variant="outlined"
          sx={{
            width: 300,
            mx: 'auto', // margin left & right
            my: 4, // margin top & botom
            py: 3, // padding top & bottom
            px: 2, // padding left & right
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 'sm',
            boxShadow: 'md',
          }}>
            <div  style={{display: "flex", justifyContent: "center"}}>
            <Image src="/pu.svg" alt="home" width={220} height={180}/>
            </div>
          <Button onClick={() => {signIn('github')}}>
            Sign with GitHub
            </Button>
          <Button onClick={() => {signIn('42-school')}}>
            Sign with 42school
            </Button>
        </Sheet>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </CssVarsProvider>
    </>
  )
}

// export function _Login() {
//   const router = useRouter();

//   useEffect(() => {
//     if (isLoggedIn()) router.push("/clients");
//   }, []);

//   async function onSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     user_data._name = event.currentTarget.username.value;
//     console.log(event.currentTarget.username.value);
//     await axios
//       .post(
//         "/server/api/auth/login",
//         {
//           username: event.currentTarget.username.value,
//           password: event.currentTarget.password.value,
//         },
//         { withCredentials: true }
//       )
//       .then(function (response) {
//         user_data._token = response.data.accessToken;
//         user_data._id = response.data.id;
//         console.log(user_data._id);
//         // user_data._pass = event.currentTarget.password.value;
//         socket.emit("authorize", user_data._token);
//         const loginUser = {
//           id: response.data.id,
//           username: response.data.username,
//           jwt: user_data._token,
//         };
//         window.localStorage.setItem("loginUser", JSON.stringify(loginUser));
//         router.push("/clients");
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }

//   return (
//     <Box component="form" onSubmit={onSubmitHandler}>
//       <Typography>Login</Typography>
//       <FormControl>
//         <TextField variant="outlined" name="username"></TextField>
//         <TextField variant="outlined" name="password"></TextField>
//       </FormControl>
//       <Button type="submit">Login</Button>
//     </Box>
//     // <div>
//     //   <form onSubmit={onSubmitHandler}>
//     //     <input type="text" id="username" name="username" />
//     //     <br />
//     //     <input type="text" id="password" name="password" />
//     //     <br />
//     //     <button type="submit">Login</button>
//     //   </form>
//     // </div>
//   );
// }
