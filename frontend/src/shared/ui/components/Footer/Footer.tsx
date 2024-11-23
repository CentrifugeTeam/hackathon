import styles from "./Footer.module.scss";
import { Logo } from "../Logo";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
			<div className={styles.content}>
				<Logo />

				<div className={styles.context}>
					<h3>Проект</h3>
					<p className={styles.text}>Наш Github</p>
					<p className={styles.text}>Презентация</p>
				</div>

				<div className={styles.context}>
					<h3>Сайт</h3>
					<p className={styles.text}>Новости</p>
					<p className={styles.text}>Мероприятия</p>
				</div>

				<div className={styles.context}>
					<h3>О нас</h3>
					<p className={styles.text}>Связь</p>
					<p className={styles.text}>Команда</p>
				</div>

				<div className={styles.context}>
					<h3>Спонсоры</h3>
					<p className={styles.text}>ВФСК ГТО</p>
					<p className={styles.text}>Миниспорт Россия</p>
				</div>

			</div>
    </footer>
  );
};

export default Footer;
