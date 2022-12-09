import styles from "../styles/layout.module.css"
import {
  Container,
  CssBaseline,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Header from "./Header";

const sections = [
  { title: 'dm', url: '/dm' },
  { title: '', url: '#' },
];

export default function Layout({ children }) {
  /*
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>PNMP</div>
      </div>
      <div className={styles.body}>
        <div className={styles.navBar}>
        </div>
      </div>
    </div>
  );
  */
  return (
    <Container maxWidth="xl">
      <Header title="PNMP" sections={sections} />
    </Container>
  );
}
