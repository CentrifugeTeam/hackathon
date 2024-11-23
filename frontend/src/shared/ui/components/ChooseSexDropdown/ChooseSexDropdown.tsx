import { useState, useEffect, useRef } from "react";
import styles from "../dropdown.module.scss";
import Arrow from "../../../../assets/iconamoon_arrow-up-2-light.svg";

interface ChooseSexDropdownProps {
  label: string;
  value: string[];
  setValue: (value: string[]) => void;
  options: string[];
  onSearch: (query: string) => void;
}

export const ChooseSexDropdown = ({
  label,
  value,
  setValue,
  options,
  onSearch,
}: ChooseSexDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>(value);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    setValue(localValue);
  }, [localValue, setValue]);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [options, searchQuery]);

  useEffect(() => {
    onSearch(searchQuery);
    setFilteredOptions([]); // Clear filtered options when search query changes
  }, [searchQuery, onSearch]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !isEditing
    ) {
      setIsOpen(false);
      setIsEditing(false);
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
  }, [isOpen, isEditing]);

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
    setSearchQuery("");
    setFilteredOptions([]); // Clear filtered options on clear
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

  const handleEdit = () => {
    setIsEditing(true);
    setSearchQuery("");
    setFilteredOptions([]); // Clear filtered options on start editing
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <label className={styles.label}>{label}</label>
      <div className={styles.select} onClick={toggleDropdown}>
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

export default ChooseSexDropdown;
