import { useRouter } from "next/dist/client/router";
import { logout } from "../lib/login";

import axios from "axios";
import { useSession } from "next-auth/react";
import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Image from "next/image";
import { socket } from "../lib/socket";
import { CircularProgress } from "@mui/material";

export default function Loading() {
  console.log("This is Loading");

  const router = useRouter();
  const { data: session, status: status } = useSession();

  if (status === "authenticated") {
    axios
      .post("/server/api/auth/login", {
        email: session.user.email,
        accessToken: session.accessToken,
      })
      .then((res) => {
        if (res.data.firstLogin) {
          router.replace("/signup");
        } else if (res.data.twoFactorAuth === true) {
          router.replace("/2fa");
        } else {
          socket.emit("authorize", res.data.accessToken);
          const loginUser = {
            id: res.data.id,
            username: res.data.username,
            jwt: res.data.accessToken,
          };
          window.localStorage.setItem("loginUser", JSON.stringify(loginUser));
          router.replace("/clients");
        }
      })
      .catch((res) => {
        console.log(res);
        logout();
      });
  } else {
    return (
      <CssVarsProvider>
        <Sheet
          variant="outlined"
          sx={{
            width: 300,
            height: 330,
            mx: "auto", // margin left & right
            my: 4, // margin top & botom
            py: 4, // padding top & bottom
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
          <CircularProgress />
        </Sheet>
      </CssVarsProvider>
    );
  }
}
