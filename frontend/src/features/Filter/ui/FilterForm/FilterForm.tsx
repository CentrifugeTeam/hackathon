import { useState } from "react";
import { useEvents } from "../../api/eventName";
import { useSportEvents } from "../../api/sportName";
import { useLocationEvents } from "../../api/locationName"; // Импортируем хук useLocationEvents
import { MultiSelectDropdown } from "../../../../shared/ui/components/MultiSelectDropdown";
import styles from "./filterform.module.scss";
import { ChooseSexDropdown } from "../../../../shared/ui/components/ChooseSexDropdown";
import { ChooseAgeInput } from "../../../../shared/ui/components/ChooseAgeInput";
import { ChooseMemberCount } from "../../../../shared/ui/components/ChooseMemberCount";
import { ChooseDateInput } from "../../../../shared/ui/components/ChooseDateInput";
import { useSexEvents } from "../../api/sexName";
import { useCompetitionEvents } from "../../api/competitionName";

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
  const [sexQuery, setSexQuery] = useState<string>("");
  const [sex, setSex] = useState<string[]>([]);
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [memberCount, setMemberCount] = useState<string>("");
  const [programQuery, setProgramQuery] = useState<string>("");
  const [disciplineQuery, setDisciplineQuery] = useState<string>("");

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

  const {
    data: locationData,
    isLoading: isLoadingLocations,
    error: errorLocations,
    fetchNextPage: fetchNextLocationPage,
    hasNextPage: hasNextLocationPage,
  } = useLocationEvents(1, 20, searchQuery); // Передаем поисковый запрос для локаций

  const { data: sexEventData } = useSexEvents(sexQuery);

  const { data: programData } = useCompetitionEvents(
    "program",
    1,
    30,
    programQuery
  );
  const { data: disciplineData } = useCompetitionEvents(
    "discipline",
    1,
    30,
    disciplineQuery
  );

  const toggleFilter = () => {
    setFilterVisible(!isFilterVisible);
  };

  const clearFilters = () => {
    setMultiSelectEventName([]);
    setMultiSelectSportType([]);
    setMultiSelectValues3([]);
    setMultiSelectValues4([]);
    setMultiSelectValues5([]);
    setSearchQuery("");
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

  const locationOptions = locationData
    ? locationData.pages.flatMap((page) => page.items.map((item) => item.city))
    : [];

  const sexOptions = sexEventData
    ? sexEventData.items.map((item) => item.name)
    : [];

  const programOptions = programData
    ? programData.pages.flatMap((page) => page.items.map((item) => item.name))
    : [];

  const disciplineOptions = disciplineData
    ? disciplineData.pages.flatMap((page) =>
        page.items.map((item) => item.name)
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
          options={disciplineOptions}
          fetchMoreOptions={() => {}}
          hasNextPage={false}
          onSearch={setDisciplineQuery} // Передаем функцию обновления поискового запроса
        />
        <MultiSelectDropdown
          label="Место проведения"
          value={multiSelectValues4}
          setValue={setMultiSelectValues4}
          options={locationOptions}
          fetchMoreOptions={fetchNextLocationPage}
          hasNextPage={!!hasNextLocationPage}
          onSearch={setSearchQuery} // Передаем функцию обновления поискового запроса
        />
        <MultiSelectDropdown
          label="Программа"
          value={multiSelectValues5}
          setValue={setMultiSelectValues5}
          options={programOptions}
          fetchMoreOptions={() => {}}
          hasNextPage={false}
          onSearch={setProgramQuery} // Передаем функцию обновления поискового запроса
        />

        <div className={styles.inputs_flex}>
          <ChooseSexDropdown
            label="Выберите пол"
            value={sex}
            setValue={setSex}
            options={sexOptions} // Уже массив строк
            onSearch={setSexQuery}
          />
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

      {isLoadingLocations && <p>Загрузка локаций...</p>}
      {errorLocations && <p>Произошла ошибка при загрузке данных локаций.</p>}
    </>
  );
};

export default FilterForm;
