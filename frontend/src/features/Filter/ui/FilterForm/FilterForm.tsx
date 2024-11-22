import { useState } from "react";
import styles from "./filterform.module.scss";
import { Dropdown } from "../../../../shared/ui/components/Dropdown";

export const FilterForm = () => {
  const [isFilterVisible, setFilterVisible] = useState(false);

  const toggleFilter = () => {
    setFilterVisible(!isFilterVisible);
  };

  return (
    <>
      <div className={styles.buttons}>
        <button className={styles.clear}>Очистить фильтр</button>
        <button className={styles.show} onClick={toggleFilter}>
          {isFilterVisible ? "Скрыть фильтры" : "Показать фильтр"}
        </button>
      </div>

      <div
        className={`${styles.inputs} ${
          isFilterVisible ? styles.visible : styles.hidden
        }`}
      >
        <Dropdown />
      </div>
    </>
  );
};

export default FilterForm;
