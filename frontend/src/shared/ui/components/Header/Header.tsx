import styles from "./header.module.scss";
import Bell from "../../../../assets/proicons_bell.svg";
import { Logo } from "../Logo";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
				<Logo />
        <section className={styles.elements}>
          <a className={styles.elem}>Минспорт Росcия</a>
          <a className={styles.elem}>ФГИС “Спорт”</a>
          <a className={styles.elem}>“Спорт - норма жизни”</a>
          <a className={styles.elem}>ВФСК ГТО</a>
        </section>

        <div className={styles.bell_block}>
          <img src={Bell} alt="" />
        </div>
      </div>
    </header>
  );
};

export default Header;
