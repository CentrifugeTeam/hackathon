import { useState } from "react";
import styles from "./header.module.scss";
import Bell from "../../../../assets/proicons_bell.svg";
import BellWhite from "../../../../assets/proicons_bellWhite.svg"
import CloseMobileMenu from "../../../../assets/closeMobileMenu.svg";
import OpenedMobileMenu from "../../../../assets/openedMobileMenu.svg";
import { Logo } from "../Logo";
import { MobileMenu } from "../MobileMenu";

export const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <section className={styles.elements}>
            <a className={styles.elem}>Минспорт Россия</a>
            <a className={styles.elem}>ФГИС “Спорт”</a>
            <a className={styles.elem}>“Спорт - норма жизни”</a>
            <a className={styles.elem}>ВФСК ГТО</a>
          </section>

          <div className={styles.mobileMenuAndBell}>
						{isMobileMenuOpen ? (
							<>
								<img onClick={toggleMobileMenu} className={styles.mobileMenu} src={OpenedMobileMenu} alt="" />
								<div className={styles.bell_block}>
									<img src={BellWhite} alt="Уведомление" />
								</div>
							</>
						) : (
							<>
								<img onClick={toggleMobileMenu} className={styles.mobileMenu} src={CloseMobileMenu} alt="" />
								<div className={styles.bell_block}>
									<img src={Bell} alt="Уведомление" />
								</div>
							</>
						)}
          </div>
        </div>
      </header>
      <hr className={styles.hr} />

      {isMobileMenuOpen && <MobileMenu />}
    </>
  );
};

export default Header;
