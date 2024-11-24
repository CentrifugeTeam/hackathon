import { useState, useEffect, useRef, useCallback } from "react";
import styles from "../dropdown.module.scss";
import Arrow from "../../../../assets/iconamoon_arrow-up-2-light.svg";

interface MultiSelectDropdownProps {
  label?: string;
  value?: string[];
  setValue?: (value: string[]) => void;
  options?: string[];
  fetchMoreOptions?: () => void;
  hasNextPage?: boolean;
  onSearch?: (query: string) => void;
	isEror?: boolean;
}

export const MultiSelectDropdown = ({
  label = "Поиск...",
  value = [],
  setValue = () => {},
  options = [],
  fetchMoreOptions = () => {},
  hasNextPage = false,
  onSearch = () => {},
	isEror = false
}: MultiSelectDropdownProps) => {
	console.log(isEror)
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  // Используем useRef для хранения предыдущего значения value
  const prevValueRef = useRef(value);

  // Сравниваем только значение value, чтобы избежать лишних обновлений
  useEffect(() => {
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      setLocalValue(value); // Обновляем localValue, если value изменилось
    }
  }, [value]);

  // Когда localValue изменяется, обновляем setValue
  useEffect(() => {
    setValue(localValue);
  }, [localValue, setValue]);

  // Фильтрация опций на основе поискового запроса
  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [options, searchQuery]);

  // Обработка поиска
  useEffect(() => {
    onSearch(searchQuery);
    setFilteredOptions([]); // Очищаем фильтрованные опции при изменении поискового запроса
  }, [searchQuery, onSearch]);

  // Обработчик клика вне дропдауна для его закрытия
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !isEditing
      ) {
        setIsOpen(false);
        setIsEditing(false);
      }
    },
    [isEditing]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Обработчик выбора опции
  const handleSelect = (item: string) => {
    setLocalValue((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Очистка выбора
  const handleClear = () => {
    setLocalValue([]);
    setSearchQuery("");
    setFilteredOptions([]); // Очищаем фильтрованные опции при очистке
  };

  // Отображение выбранных элементов
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

  // Включение режима редактирования (поиск)
  const handleEdit = () => {
    setIsEditing(true);
    setSearchQuery("");
    setFilteredOptions([]); // Очищаем фильтрованные опции при начале редактирования
  };

  // Обработка прокрутки списка и загрузка дополнительных опций
  const handleScroll = () => {
    if (menuRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = menuRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5 && hasNextPage) {
        fetchMoreOptions();
      }
    }
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <label className={`${styles.label} ${isEror ? styles.textError : ''}`}>{label}</label>
      <div className={styles.select} onClick={toggleDropdown}>
        {isEditing ? (
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
            className={`${styles.searchInput} ${isEror ? styles.inputError : ''}`}
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
        <ul className={styles.menu} ref={menuRef} onScroll={handleScroll}>
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
