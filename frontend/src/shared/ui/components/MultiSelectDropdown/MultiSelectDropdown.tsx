import { useState, useEffect, useRef } from "react";
import styles from "../dropdown.module.scss";
import Arrow from "../../../../assets/iconamoon_arrow-up-2-light.svg";

interface MultiSelectDropdownProps {
  label: string;
  value: string[];
  setValue: (value: string[]) => void;
  options: string[]; // Добавляем options, который передается как пропс
}

export const MultiSelectDropdown = ({
  label,
  value,
  setValue,
  options, // Пропс options
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [searchQuery, setSearchQuery] = useState(""); // Состояние для поискового запроса
  const [isEditing, setIsEditing] = useState(false); // Состояние для редактирования (при клике на span)
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
      !dropdownRef.current.contains(event.target as Node) &&
      !isEditing // Если мы редактируем, меню не закрывается
    ) {
      setIsOpen(false);
      setIsEditing(false); // Если кликнули вне, скрыть поле редактирования
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
  }, [isOpen, isEditing]); // Следим за состоянием isEditing

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
    setSearchQuery(""); // Очистить запрос поиска
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

  // Фильтрация опций по поисковому запросу
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Обработчик для старта редактирования
  const handleEdit = () => {
    setIsEditing(true);
    setSearchQuery(""); // Очистить текущий запрос при редактировании
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <label className={styles.label}>{label}</label>
      <div className={styles.select} onClick={toggleDropdown}>
        {/* Если редактируем, показываем поле ввода */}
        {isEditing ? (
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
            className={styles.searchInput}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <span onClick={handleEdit}>
            {localValue.length > 0 ? renderSelectedItems() : "Поиск..."}
          </span>
        )}
        <span className={isOpen ? styles.arrowOpen : styles.arrowClosed}>
          <img src={Arrow} alt="Arrow" />
        </span>
      </div>
      {isOpen && (
        <ul className={styles.menu}>
          <li className={styles.clear} onClick={handleClear}>
            Очистить выбор
          </li>
          {filteredOptions.map((option) => (
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
