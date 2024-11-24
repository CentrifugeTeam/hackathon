import { useEffect } from "react";
import styles from "./MobileMenu.module.scss";

export const MobileMenu = () => {
  useEffect(() => {
    // Отключаем прокрутку на body, когда меню открыто
    document.body.style.overflow = "hidden";

    // Очищаем эффект при размонтировании компонента (когда меню закрывается)
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.menuContent} onClick={(e) => e.stopPropagation()}>
        <a href="https://gto.ru/" className={styles.text}>
          ВФСК ГТО
        </a>
        <a href="https://github.com/CentrifugeTeam" className={styles.text}>
          Наш GitHub
        </a>
        <a
          href="https://drive.google.com/file/d/1EjmdGXJSJvw57hX4JASA24q86qhoRaUP/view?usp=share_link"
          className={styles.text}
        >
          Презентация
        </a>
        <a href="https://gis.fcpsr.ru/" className={styles.text}>
          ФГИС “Спорт”
        </a>
        <a href="https://www.minsport.gov.ru/" className={styles.text}>
          Минспорта России
        </a>
        <a href="https://norma-sport.ru/" className={styles.text}>
          “Спорт - норма жизни”
        </a>
      </div>
    </div>
  );
};
