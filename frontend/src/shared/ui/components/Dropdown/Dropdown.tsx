import { useState } from "react";
import styles from "./dropdown.module.scss";

export const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>("Все");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: string) => {
    setSelected(item);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <label className={styles.label}>Вид мероприятия</label>
      <div className={styles.select} onClick={toggleDropdown}>
        <span>{selected}</span>
        <span className={styles.arrow}>▼</span>
      </div>
      {isOpen && (
        <ul className={styles.menu}>
          <li onClick={() => handleSelect("Все")}>Все</li>
          <li onClick={() => handleSelect("Спортивные")}>Спортивные</li>
          <li onClick={() => handleSelect("Культурные")}>Культурные</li>
          <li onClick={() => handleSelect("Образовательные")}>
            Образовательные
          </li>
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
