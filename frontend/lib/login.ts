import axios from "axios";
import { signOut } from "next-auth/react";

export function isLoggedIn(): boolean {
  return !!window.localStorage.loginUser;
}

export function logout() {
  axios
    .post("/server/api/auth/logout")
    .then(async (res) => {
      window.localStorage.removeItem("loginUser");
    })
    .catch((e) => {
      console.error(e);
    });
  signOut({callbackUrl: "/"});
}

export function getLoginUser() {
  let loginUser: any;
  if (typeof window !== "undefined") {
    console.log(localStorage.getItem("loginUser"));
    loginUser = JSON.parse(
      localStorage?.getItem("loginUser") ?? '{ "id": null, "username": null }'
    );
  } else {
    loginUser = { id: null, username: null };
  }
  return loginUser;
}

console.log("this is login.ts");
