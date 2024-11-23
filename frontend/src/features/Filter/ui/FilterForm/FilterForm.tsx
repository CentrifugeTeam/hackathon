import { useState } from "react";
import { useEvents } from "../../api/eventName";
import { useSportEvents } from "../../api/sportName";
import { MultiSelectDropdown } from "../../../../shared/ui/components/MultiSelectDropdown";
import styles from "./filterform.module.scss";
import { ChooseSexDropdown } from "../../../../shared/ui/components/ChooseSexDropdown";
import { ChooseAgeInput } from "../../../../shared/ui/components/ChooseAgeInput";
import { ChooseMemberCount } from "../../../../shared/ui/components/ChooseMemberCount";
import { ChooseDateInput } from "../../../../shared/ui/components/ChooseDateInput";

export const FilterForm = () => {
  const [isFilterVisible, setFilterVisible] = useState(false);

  const [multiSelectEventName, setMultiSelectEventName] = useState<string[]>(
    []
  );
  const [multiSelectSportType, setMultiSelectSportType] = useState<string[]>(
    []
  );
  const [multiSelectValues3, setMultiSelectValues3] = useState<string[]>([]);
  const [multiSelectValues4, setMultiSelectValues4] = useState<string[]>([]);
  const [multiSelectValues5, setMultiSelectValues5] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>(""); // Состояние для поискового запроса
  const [sex, setSex] = useState<string[]>([]);
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [memberCount, setMemberCount] = useState<string>("");

  const {
    data: eventData,
    isLoading: isLoadingEvents,
    error: errorEvents,
    fetchNextPage: fetchNextEventPage,
    hasNextPage: hasNextEventPage,
  } = useEvents(1, 10, searchQuery); // Передаем поисковый запрос

  const {
    data: sportEventData,
    isLoading: isLoadingSports,
    error: errorSports,
    fetchNextPage: fetchNextSportPage,
    hasNextPage: hasNextSportPage,
  } = useSportEvents(1, 10, searchQuery); // Передаем поисковый запрос для видов спорта

  const toggleFilter = () => {
    setFilterVisible(!isFilterVisible);
  };

  const clearFilters = () => {
    setMultiSelectEventName([]);
    setMultiSelectSportType([]);
    setMultiSelectValues3([]);
    setMultiSelectValues4([]);
    setMultiSelectValues5([]);
    setSearchQuery(""); // Очистить поисковый запрос
    setSex([]);
    setMinAge("");
    setMaxAge("");
    setDate("");
    setMemberCount("");
  };

  const eventOptions = eventData
    ? eventData.pages.flatMap((page) => page.items.map((item) => item.name))
    : [];

  const sportEventOptions = sportEventData
    ? sportEventData.pages.flatMap((page) =>
        page.items.map((item) => item.sport)
      )
    : [];

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
        <MultiSelectDropdown
          label="Название мероприятия"
          value={multiSelectEventName}
          setValue={setMultiSelectEventName}
          options={eventOptions}
          fetchMoreOptions={fetchNextEventPage}
          hasNextPage={!!hasNextEventPage}
          onSearch={setSearchQuery} // Передаем функцию обновления поискового запроса
        />
        <MultiSelectDropdown
          label="Вид спорта"
          value={multiSelectSportType}
          setValue={setMultiSelectSportType}
          options={sportEventOptions}
          fetchMoreOptions={fetchNextSportPage}
          hasNextPage={!!hasNextSportPage}
          onSearch={setSearchQuery} // Передаем функцию обновления поискового запроса
        />
        <MultiSelectDropdown
          label="Дисциплина"
          value={multiSelectValues3}
          setValue={setMultiSelectValues3}
          options={["Дисциплина 1", "Дисциплина 2"]}
          fetchMoreOptions={() => {}}
          hasNextPage={false}
          onSearch={() => {}} // Пустая функция
        />
        <MultiSelectDropdown
          label="Место проведения"
          value={multiSelectValues4}
          setValue={setMultiSelectValues4}
          options={["Москва", "Санкт-Петербург"]}
          fetchMoreOptions={() => {}}
          hasNextPage={false}
          onSearch={() => {}} // Пустая функция
        />
        <MultiSelectDropdown
          label="Программа"
          value={multiSelectValues5}
          setValue={setMultiSelectValues5}
          options={["Программа 1", "Программа 2"]}
          fetchMoreOptions={() => {}}
          hasNextPage={false}
          onSearch={() => {}} // Пустая функция
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

      {isLoadingEvents && <p>Загрузка мероприятий...</p>}
      {errorEvents && <p>Произошла ошибка при загрузке данных мероприятий.</p>}

      {isLoadingSports && <p>Загрузка видов спорта...</p>}
      {errorSports && <p>Произошла ошибка при загрузке данных видов спорта.</p>}
    </>
  );
};

export default FilterForm;
