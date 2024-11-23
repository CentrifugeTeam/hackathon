import styles from "./Footer.module.scss";
import { Logo } from "../Logo";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <Logo />

        <div className={styles.context}>
          <h3>Проект</h3>
          <a className={styles.text}>Наш Github</a>
          <a className={styles.text}>Презентация</a>
        </div>

        <div className={styles.context}>
          <h3>Сайт</h3>
          <a className={styles.text}>Новости</a>
          <a className={styles.text}>Мероприятия</a>
        </div>

        <div className={styles.context}>
          <h3>О нас</h3>
          <a className={styles.text}>Связь</a>
          <a className={styles.text}>Команда</a>
        </div>

        <div className={styles.context}>
          <h3>Спонсоры</h3>
          <a className={styles.text}>ВФСК ГТО</a>
          <a className={styles.text}>Миниспорт Россия</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
