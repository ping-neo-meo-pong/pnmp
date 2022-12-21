import Head from "next/head";
import Image from "next/image";
// import styles from '../styles/Home.module.css'
import React from "react";
import { useRouter } from "next/dist/client/router";
import { useState, useEffect } from "react";
// import Link from "next/link";
import { isLoggedIn, logout } from "../lib/login";

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';


// export default function Home() {
//   const router = useRouter();

//   useEffect(() => {
//     router.push(isLoggedIn() ? "/clients" : "/login");
//   });

//   return <></>;
// }

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
         <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
                  <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => signIn('github')}
            >
              Sign With GitHub
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => signIn('42-school')}
            >
              Sign With 42School
            </Button>
      </Box>
    </>
  )
}