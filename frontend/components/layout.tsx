import styles from "../styles/layout.module.css";
import Container from "@mui/material/Container";
import Header from "./Header";
import Body from "./Body";
import { useState } from 'react';
import { LoginUserContext } from '../lib/contexts';

export default function Layout({ children }: any) {
  const [ myProfileImage, setMyProfileImage ] = useState(null);
  const [ myName, setMyName ] = useState(null);

  return (
    <LoginUserContext.Provider value={{
      myProfileImage,
      setMyProfileImage,
      myName,
      setMyName,
    }}>
      <Container maxWidth="xl">
        <Header title="PNMP" />
        <Body>{children}</Body>
      </Container>
    </LoginUserContext.Provider>
  );
}
