import styles from "../styles/layout.module.css"
import Container from '@mui/material/container';
import Header from "./Header";
import Body from "./Body";

export default function Layout({ children }) {
  return (
    <Container maxWidth="xl">
      <Header title="PNMP" />
      <Body>
        { children }
      </Body>
    </Container>
  );
}
