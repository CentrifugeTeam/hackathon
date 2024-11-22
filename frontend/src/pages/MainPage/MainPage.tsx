import { FilterForm } from "../../features/Filter/ui/FilterForm";
import styles from "./mainpage.module.scss";

export const MainPage = () => {
  return (
    <>
      <h1 className={styles.title}>
        <span className={styles.unique}>ЕДИНЫЙ</span> КАЛЕНДАРЬ ПЛАН
        ФИЗКУЛЬТУРНЫХ
        <br /> И СПОРТИВНЫХ МЕРОПРИЯТИЙ
      </h1>
      <FilterForm />
    </>
  );
};

export default MainPage;
