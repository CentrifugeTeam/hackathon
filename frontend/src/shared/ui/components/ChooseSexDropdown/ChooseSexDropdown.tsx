import { useState, useEffect, useRef } from "react";
import styles from "../dropdown.module.scss";
import Arrow from "../../../../assets/iconamoon_arrow-up-2-light.svg";

// Опции для выбора
const options = ["Мужской", "Женский"];

export const ChooseSexDropdown = ({
  value,
  setValue,
}: {
  value: string[]; // Указываем, что value теперь массив строк
  setValue: (value: string[]) => void; // setValue теперь принимает массив строк
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [searchQuery, setSearchQuery] = useState(""); // Состояние для поискового запроса
  const [isEditing, setIsEditing] = useState(false); // Состояние для редактирования
  const dropdownRef = useRef<HTMLDivElement>(null); // Реф для отслеживания кликов вне области

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    setValue(localValue);
  }, [localValue, setValue]);

  // Обработчик клика вне области
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setIsEditing(false); // Скрыть поле редактирования, если кликнули вне области
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

  // Обработчик для старта редактирования
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Фильтрация опций по поисковому запросу
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Обработчик выбора опции
  const handleSelect = (item: string) => {
    if (localValue.includes(item)) {
      setLocalValue(localValue.filter((value) => value !== item)); // Удалить, если уже выбран
    } else {
      setLocalValue([...localValue, item]); // Добавить, если не выбран
    }
  };

  const handleClear = () => {
    setLocalValue([]); // Очистить все выбранные значения
    setSearchQuery(""); // Очистить поисковый запрос
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
    <div className={styles.dropdown_2} ref={dropdownRef}>
      <label className={styles.label}>Выберите пол</label>
      <div className={styles.select_sex} onClick={() => setIsOpen(!isOpen)}>
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
            {localValue.length > 0 ? renderSelectedItems() : "Выберите"}
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

export default ChooseSexDropdown;
