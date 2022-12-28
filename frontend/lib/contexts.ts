import { createContext } from "react";

export const LoginUserContext = createContext<{
  myProfileImage: string | null;
  setMyProfileImage: Function | null;
  myName: string | null;
  setMyName: Function | null;
}>({
  myProfileImage: null,
  setMyProfileImage: null,
  myName: null,
  setMyName: null,
});
