import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from 'axios';

export function isLoggedIn(): boolean {
  console.log(`isLoggedIn(): localStorage.isLoggedIn: ${window.localStorage.isLoggedIn}`);
  return !!window.localStorage.isLoggedIn;
}

export function useLoginGuard() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn())
      router.push("/login");
  }, []);
}

export async function logout() {
  await axios.post('server/api/auth/logout');
  window.localStorage.isLoggedIn = '';
}
