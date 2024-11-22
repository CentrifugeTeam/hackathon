import { useEffect, useState, useRef } from "react";
import styles from "../dropdown.module.scss";
import Arrow from "../../../../assets/iconamoon_arrow-up-2-light.svg";

const options = ["Все", "Спортивные", "Культурные", "Образовательные"];

export const SingleSelectDropdown = ({
  value,
  setValue,
}: {
  value: string; // Указываем, что value - это строка
  setValue: (value: string) => void; // Указываем, что setValue принимает строку
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const dropdownRef = useRef<HTMLDivElement>(null); // Реф для отслеживания кликов вне области

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: string) => {
    setLocalValue(item);
    setValue(item);
    setIsOpen(false);
  };

  // Обработчик кликов вне области dropdown
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false); // Закрыть меню
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Очистка обработчика при размонтировании
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <label className={styles.label}>Вид мероприятия</label>
      <div className={styles.select} onClick={toggleDropdown}>
        <span>{localValue || "Выберите"}</span>
        <span className={isOpen ? styles.arrowOpen : styles.arrowClosed}>
          <img src={Arrow} alt="Arrow" />
        </span>
      </div>
      {isOpen && (
        <ul className={styles.menu}>
          {options.map((option) => (
            <li key={option} onClick={() => handleSelect(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SingleSelectDropdown;
