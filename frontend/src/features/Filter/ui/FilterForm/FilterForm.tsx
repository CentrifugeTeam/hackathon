import { useState } from "react";
import { useEvents } from "../../api/eventName"; // Импортируем хук useEvents
import { MultiSelectDropdown } from "../../../../shared/ui/components/MultiSelectDropdown";
import styles from "./filterform.module.scss";
import { ChooseSexDropdown } from "../../../../shared/ui/components/ChooseSexDropdown";
import { ChooseAgeInput } from "../../../../shared/ui/components/ChooseAgeInput";
import { ChooseMemberCount } from "../../../../shared/ui/components/ChooseMemberCount";
import { ChooseDateInput } from "../../../../shared/ui/components/ChooseDateInput";

// Компонент FilterForm
export const FilterForm = () => {
  const [isFilterVisible, setFilterVisible] = useState(false);

  // Состояния для значений в каждом MultiSelectDropdown
  const [multiSelectEventName, setMultiSelectEventName] = useState<string[]>(
    []
  );
  const [multiSelectSportType, setMultiSelectSportType] = useState<string[]>(
    []
  );
  const [multiSelectValues3, setMultiSelectValues3] = useState<string[]>([]);
  const [multiSelectValues4, setMultiSelectValues4] = useState<string[]>([]);
  const [multiSelectValues5, setMultiSelectValues5] = useState<string[]>([]);

  // Данные для фильтрации
  const [sex, setSex] = useState<string[]>([]);
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [memberCount, setMemberCount] = useState<string>("");

  // Используем хук useEvents для получения данных о событиях
  const { data: eventData, isLoading, error } = useEvents(1, 5);

  const toggleFilter = () => {
    setFilterVisible(!isFilterVisible);
  };

  const clearFilters = () => {
    setMultiSelectEventName([]);
    setMultiSelectSportType([]);
    setMultiSelectValues3([]);
    setMultiSelectValues4([]);
    setMultiSelectValues5([]);
    setSex([]); // Очищаем массив пола
    setMinAge("");
    setMaxAge("");
    setDate("");
    setMemberCount("");
  };

  return (
    <>
      <div className={styles.buttons}>
        <h1 className={isFilterVisible ? "" : styles.hidden}>
          ЗАПОЛНИТЕ ФОРМУ
        </h1>
        <div>
          {isFilterVisible && (
            <button className={styles.clear} onClick={clearFilters}>
              Очистить фильтр
            </button>
          )}
          <button className={styles.show} onClick={toggleFilter}>
            {isFilterVisible ? "Скрыть фильтры" : "Показать фильтры"}
          </button>
        </div>
      </div>

      <div
        className={`${styles.inputs} ${
          isFilterVisible ? styles.visible : styles.hidden
        }`}
      >
        {/* Используем данные из useEvents */}
        <MultiSelectDropdown
          label="Название мероприятия"
          value={multiSelectEventName}
          setValue={setMultiSelectEventName}
          options={eventData ? eventData.items.map((item) => item.name) : []} // Передаем массив с названиями мероприятий
        />
        <MultiSelectDropdown
          label="Вид спорта"
          value={multiSelectSportType}
          setValue={setMultiSelectSportType}
          options={["Футбол", "Баскетбол", "Теннис"]} // Пример данных для "Вид спорта"
        />
        <MultiSelectDropdown
          label="Дисциплина"
          value={multiSelectValues3}
          setValue={setMultiSelectValues3}
          options={["Дисциплина 1", "Дисциплина 2"]} // Пример данных для "Дисциплина"
        />
        <MultiSelectDropdown
          label="Место проведения"
          value={multiSelectValues4}
          setValue={setMultiSelectValues4}
          options={["Москва", "Санкт-Петербург"]} // Пример данных для "Место проведения"
        />
        <MultiSelectDropdown
          label="Программа"
          value={multiSelectValues5}
          setValue={setMultiSelectValues5}
          options={["Программа 1", "Программа 2"]} // Пример данных для "Программа"
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

      {/* Показываем индикатор загрузки или ошибку */}
      {isLoading && <p>Загрузка мероприятий...</p>}
      {error && <p>Произошла ошибка при загрузке данных.</p>}
    </>
  );
};

export default FilterForm;
