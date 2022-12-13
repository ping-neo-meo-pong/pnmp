import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from 'axios';

export function isLoggedIn(): boolean {
  console.log(`isLoggedIn(): localStorage.loginUser: ${window.localStorage.loginUser}`);
  return !!window.localStorage.loginUser;
}

export function useLoginGuard() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn())
      router.push("/login");
  }, []);
}

export async function logout() {
  await axios.post('/server/api/auth/logout');
  window.localStorage.removeItem("loginUser");
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

console.log('this is login.ts');
