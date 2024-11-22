import { useState, useEffect, useRef } from "react";
import styles from "../dropdown.module.scss";
import Arrow from "../../../../assets/iconamoon_arrow-up-2-light.svg";

const options = [
  "Все",
  "Спортивные",
  "Культурные",
  "Образовательные",
  "Обраывзовательные",
  "ыфв",
  "Образовыфвательные",
  "Образвыфвовательные",
];

export const MultiSelectDropdown = ({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string[];
  setValue: (value: string[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const dropdownRef = useRef<HTMLDivElement>(null); // Реф для отслеживания кликов вне области

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    setValue(localValue);
  }, [localValue, setValue]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: string) => {
    setLocalValue((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleClear = () => {
    setLocalValue([]);
  };

  const renderSelectedItems = () => {
    if (localValue.length <= 2) {
      return localValue.join(", ");
    }
    const remainingCount = localValue.length - 2;
    return (
      <>
        {localValue.slice(0, 2).join(", ")}
        <span className={styles.remainingCount}>+{remainingCount}</span>
      </>
    );
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <label className={styles.label}>{label}</label>
      <div className={styles.select} onClick={toggleDropdown}>
        <span>
          {localValue.length > 0 ? renderSelectedItems() : "Выберите варианты"}
        </span>
        <span className={isOpen ? styles.arrowOpen : styles.arrowClosed}>
          <img src={Arrow} alt="Arrow" />
        </span>
      </div>
      {isOpen && (
        <ul className={styles.menu}>
          <li className={styles.clear} onClick={handleClear}>
            Очистить выбор
          </li>
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={localValue.includes(option) ? styles.selected : ""}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
