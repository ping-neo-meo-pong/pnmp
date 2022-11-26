import Head from 'next/head'
import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import React from 'react';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import Link from "next/link";
import Button from "@mui/material/Button";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
    
export default function Home() {
	const router = useRouter();
	return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Link href="/login">
            <Button variant="contained">Login</Button>
          </Link>
        </Box>
        <Box sx={{ my: 4 }}>
          <Link href="/tmp/main">
            <Button variant="outlined">Guest</Button>
            </Link>
        </Box>
      </Container>
		</>
	);
}