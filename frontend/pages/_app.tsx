// erimport '../styles/globals.css'
import type { AppProps } from "next/app";
import React from "react";
import { useSocketAuthorization } from "../lib/socket";

export default function App({ Component, pageProps }: AppProps) {
  useSocketAuthorization();
  return <Component {...pageProps} />;
}
