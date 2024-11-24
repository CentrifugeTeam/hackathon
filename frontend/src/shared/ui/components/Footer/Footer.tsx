import styles from "./Footer.module.scss";
import { useEffect, useState } from "react";
import { Logo } from "../Logo";

export const Footer = () => {
	const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize); // обработчик события изменения размера

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
		<>
			{isMobile && <hr style={{color: "#3169f2"}}/>}
			<footer className={styles.footer}>

				<div className={styles.logo}>
					{isMobile && <Logo />}
				</div>

				<div className={styles.content}>
					{!isMobile && <Logo />}

					<div className={styles.context}>
						<h3>Проект</h3>
						<a href="https://github.com/CentrifugeTeam" className={styles.text}>Наш Github</a>
						<a href="https://drive.google.com/file/d/1EjmdGXJSJvw57hX4JASA24q86qhoRaUP/view?usp=share_link" className={styles.text}>Презентация</a>
					</div>

					<div className={styles.context}>
						<h3>Сайт</h3>
						<a className={styles.text}>Новости</a>
						<a className={styles.text}>Мероприятия</a>
					</div>

					{!isMobile &&
						<div className={`${styles.context} ${styles.hiddenOnMobile}`}>
							<h3>О нас</h3>
							<a className={styles.text}>Связь</a>
							<a className={styles.text}>Команда</a>
						</div>
					}

					<div className={styles.context}>
						<h3>Спонсоры</h3>
						<a href="https://gto.ru/" className={styles.text}>ВФСК ГТО</a>
						<a href="https://www.minsport.gov.ru/" className={styles.text}>Миниспорт Россия</a>
					</div>
				</div>
			</footer>
		</>
  );
};

export default Footer;
