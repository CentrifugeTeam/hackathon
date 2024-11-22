import { useState } from "react";
import styles from "./filterform.module.scss";
import { SingleSelectDropdown } from "../../../../shared/ui/components/SingleSelectDropdown";
import { MultiSelectDropdown } from "../../../../shared/ui/components/MultiSelectDropdown";
import { ChooseSexDropdown } from "../../../../shared/ui/components/ChooseSexDropdown";
import { ChooseAgeInput } from "../../../../shared/ui/components/ChooseAgeInput";
import { ChooseMemberCount } from "../../../../shared/ui/components/ChooseMemberCount";
import { ChooseDateInput } from "../../../../shared/ui/components/ChooseDateInput";

export const FilterForm = () => {
  const [isFilterVisible, setFilterVisible] = useState(false);

  // Состояние для значения в SingleSelectDropdown
  const [singleSelectValue, setSingleSelectValue] = useState("Все");

  // Состояния для значений в каждом MultiSelectDropdown
  const [multiSelectValues1, setMultiSelectValues1] = useState<string[]>([]);
  const [multiSelectValues2, setMultiSelectValues2] = useState<string[]>([]);
  const [multiSelectValues3, setMultiSelectValues3] = useState<string[]>([]);
  const [multiSelectValues4, setMultiSelectValues4] = useState<string[]>([]);
  const [multiSelectValues5, setMultiSelectValues5] = useState<string[]>([]);

  const [sex, setSex] = useState<string>("");

  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");

  const [date, setDate] = useState<string>("");

  const [memberCount, setMemberCount] = useState<string>("");

  const toggleFilter = () => {
    setFilterVisible(!isFilterVisible);
  };

  const clearFilters = () => {
    setSingleSelectValue("Все");
    setMultiSelectValues1([]);
    setMultiSelectValues2([]);
    setMultiSelectValues3([]);
    setMultiSelectValues4([]);
    setMultiSelectValues5([]);
    setSex("");
    setMinAge("");
    setMaxAge("");
    setDate("");
    setMemberCount("");
  };

  return (
    <>
      <div className={styles.buttons}>
        <h1>ЗАПОЛНИТЕ ФОРМУ</h1>
        <button className={styles.clear} onClick={clearFilters}>
          Очистить фильтр
        </button>
        <button className={styles.show} onClick={toggleFilter}>
          {isFilterVisible ? "Скрыть фильтры" : "Показать фильтры"}
        </button>
      </div>

      <div
        className={`${styles.inputs} ${
          isFilterVisible ? styles.visible : styles.hidden
        }`}
      >
        <SingleSelectDropdown
          value={singleSelectValue}
          setValue={setSingleSelectValue}
        />
        <MultiSelectDropdown
          label="Тип мероприятия"
          value={multiSelectValues1}
          setValue={setMultiSelectValues1}
        />
        <MultiSelectDropdown
          label="Вид спорта"
          value={multiSelectValues2}
          setValue={setMultiSelectValues2}
        />
        <MultiSelectDropdown
          label="Дисциплина"
          value={multiSelectValues3}
          setValue={setMultiSelectValues3}
        />
        <MultiSelectDropdown
          label="Место проведения"
          value={multiSelectValues4}
          setValue={setMultiSelectValues4}
        />
        <MultiSelectDropdown
          label="Программа"
          value={multiSelectValues5}
          setValue={setMultiSelectValues5}
        />
        <div className={styles.inputs_flex}>
          <ChooseSexDropdown value={sex} setValue={setSex} />
          <ChooseAgeInput
            minAge={minAge}
            setMinAge={setMinAge}
            maxAge={maxAge}
            setMaxAge={setMaxAge}
          />
        </div>
        <ChooseMemberCount
          memberCount={memberCount}
          setMemberCount={setMemberCount}
        />
        <div className={styles.inputs_flex2}>
          <ChooseDateInput label="Начало" date={date} setDate={setDate} />
          <ChooseDateInput label="Конец" date={date} setDate={setDate} />
        </div>
        <button className={styles.search}>Поиск</button>
      </div>
    </>
  );
};

export default FilterForm;
