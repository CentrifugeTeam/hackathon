import React, { useState } from "react";
import BellSvg from "../../../../assets/proicons_bell.svg";
import BellSvgMenu from "../../../../assets/proicons_bell_menu.svg";
import styles from "./Bell.module.scss";
import { SendEmail } from "../SendEmail";

interface BellProps {
	isMenu: boolean;
}

export const Bell: React.FC<BellProps> = ({ isMenu }) => {
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  // Обработчик клика на иконку колокольчика
  const handleBellClick = () => {
    setNotificationVisible(prevState => !prevState);
  };

  return (
    <div>
      <div
        className={`${styles.bell_block} ${isMenu ? styles.menu : styles.notMenu}`}
        onClick={handleBellClick} // При клике меняем состояние
      >
        <img
          src={isMenu ? BellSvgMenu : BellSvg}
          alt="Уведомление"
        />
      </div>

      {/* Условный рендеринг плашки с уведомлением */}
      {isNotificationVisible && (
        <div className={styles.notification}>
          <SendEmail />
        </div>
      )}
    </div>
  );
};
