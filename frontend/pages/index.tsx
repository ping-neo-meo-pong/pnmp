import Head from "next/head";
import Image from "next/image";
// import styles from '../styles/Home.module.css'
import React from "react";
import { useRouter } from "next/dist/client/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { isLoggedIn, logout } from "../lib/login";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push(isLoggedIn() ? "/clients" : "/login");
  });

  return <></>;
}
