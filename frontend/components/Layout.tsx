import styles from "../styles/layout.module.css";
import Container from "@mui/material/Container";
import Header from "./Header";
import Body from "./Body";
import { useState } from 'react';
import { UserImageContext } from '../lib/contexts';

export default function Layout({ children }: any) {
  const [ userImage, setUserImage ] = useState(null);

  return (
    <UserImageContext.Provider value={{ userImage, setUserImage }}>
      <Container maxWidth="xl">
        <Header title="PNMP" />
        <Body>{children}</Body>
      </Container>
    </UserImageContext.Provider>
  );
}
