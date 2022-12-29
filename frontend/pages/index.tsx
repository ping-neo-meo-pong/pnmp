import { useRouter } from "next/dist/client/router";
import { logout } from "../lib/login";
import { useSession, signIn } from "next-auth/react";
import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Image from "next/image";
import { Typography, Link } from "@mui/material";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        ping-neo-meo-pong
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Home() {
  console.log("This is Index");

  const router = useRouter();
  const { data: session, status: status } = useSession();
  if (status === "authenticated") logout();

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
            loading={status === "loading"}
            onClick={() => {
              signIn("42-school", { callbackUrl: "/loading" });
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
