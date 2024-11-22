import { Outlet } from "react-router-dom";
import styles from "./layout.module.scss";
import { Header } from "../../shared/ui/components/Header";

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
