import { useState } from "react";
import { useEvents } from "../../api/eventName";
import { useSportEvents } from "../../api/sportName";
import { useLocationEvents } from "../../api/locationName";
import { MultiSelectDropdown } from "../../../../shared/ui/components/MultiSelectDropdown";
import styles from "./filterform.module.scss";
import { ChooseSexDropdown } from "../../../../shared/ui/components/ChooseSexDropdown";
import { ChooseAgeInput } from "../../../../shared/ui/components/ChooseAgeInput";
import { ChooseMemberCount } from "../../../../shared/ui/components/ChooseMemberCount";
import { ChooseDateInput } from "../../../../shared/ui/components/ChooseDateInput";
import { useSexEvents } from "../../api/sexName";
import { useCompetitionEvents } from "../../api/competitionName";

export const FilterForm = ({
  onFilterChange,
}: {
  onFilterChange: (filters: Record<string, any>) => void;
}) => {
  const [isFilterVisible, setFilterVisible] = useState(false);

  const [multiSelectEventName, setMultiSelectEventName] = useState<string[]>(
    []
  );
  const [multiSelectSportType, setMultiSelectSportType] = useState<string[]>(
    []
  );
  const [multiSelectValues3, setMultiSelectValues3] = useState<string[]>([]); // Дисциплина
  const [multiSelectValues4, setMultiSelectValues4] = useState<string[]>([]);
  const [multiSelectValues5, setMultiSelectValues5] = useState<string[]>([]); // Программа

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sexQuery, setSexQuery] = useState<string>("");
  const [sex, setSex] = useState<string[]>([]);
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [memberCount, setMemberCount] = useState<string>("");

  const handleSearch = () => {
    const filters = {
      sports: multiSelectSportType.join(","),
      competitions: multiSelectValues5.join(","),
      categories: multiSelectValues3.join(","),
      cities: multiSelectValues4.join(","),
      start_date: startDate || "2024-01-01",
      end_date: endDate || "2026-01-01",
    };
    onFilterChange(filters);
  };

  const {
    data: eventData,
    isLoading: isLoadingEvents,
    error: errorEvents,
    fetchNextPage: fetchNextEventPage,
    hasNextPage: hasNextEventPage,
  } = useEvents(1, 10, searchQuery);

  const {
    data: sportEventData,
    isLoading: isLoadingSports,
    error: errorSports,
    fetchNextPage: fetchNextSportPage,
    hasNextPage: hasNextSportPage,
  } = useSportEvents(1, 10, searchQuery);

  const {
    data: locationData,
    isLoading: isLoadingLocations,
    error: errorLocations,
    fetchNextPage: fetchNextLocationPage,
    hasNextPage: hasNextLocationPage,
  } = useLocationEvents(1, 20, searchQuery);

  const { data: sexEventData } = useSexEvents(sexQuery);

  const { data: programData } = useCompetitionEvents(
    "program",
    1,
    30,
    searchQuery
  );
  const { data: disciplineData } = useCompetitionEvents(
    "discipline",
    1,
    30,
    searchQuery
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
    setStartDate("");
    setEndDate("");
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

  // // Функция для отображения введенных данных
  // const handleSearch = () => {
  //   console.log("Название мероприятия:", multiSelectEventName);
  //   console.log("Вид спорта:", multiSelectSportType);
  //   console.log("Дисциплина:", multiSelectValues3); // Дисциплина теперь массив или строка
  //   console.log("Место проведения:", multiSelectValues4);
  //   console.log("Программа:", multiSelectValues5); // Программа теперь массив или строка
  //   console.log("Пол:", sex);
  //   console.log("Дата начала:", startDate);
  //   console.log("Дата окончания:", endDate);
  //   console.log("Количество участников:", memberCount);
  // };

  return (
    <div className={styles.filterForm}>
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
          onSearch={setSearchQuery}
        />
        <MultiSelectDropdown
          label="Вид спорта"
          value={multiSelectSportType}
          setValue={setMultiSelectSportType}
          options={sportEventOptions}
          fetchMoreOptions={fetchNextSportPage}
          hasNextPage={!!hasNextSportPage}
          onSearch={setSearchQuery}
        />
        <MultiSelectDropdown
          label="Дисциплина"
          value={multiSelectValues3}
          setValue={setMultiSelectValues3} // Привязка к состоянию дисциплины
          options={disciplineOptions}
          fetchMoreOptions={() => {}}
          hasNextPage={false}
          onSearch={setSearchQuery}
        />
        <MultiSelectDropdown
          label="Место проведения"
          value={multiSelectValues4}
          setValue={setMultiSelectValues4}
          options={locationOptions}
          fetchMoreOptions={fetchNextLocationPage}
          hasNextPage={!!hasNextLocationPage}
          onSearch={setSearchQuery}
        />
        <MultiSelectDropdown
          label="Программа"
          value={multiSelectValues5}
          setValue={setMultiSelectValues5} // Привязка к состоянию программы
          options={programOptions}
          fetchMoreOptions={() => {}}
          hasNextPage={false}
          onSearch={setSearchQuery}
        />

        <div className={styles.inputs_flex}>
          <ChooseSexDropdown
            label="Выберите пол"
            value={sex}
            setValue={setSex}
            options={sexOptions}
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
          <ChooseDateInput
            label="Дата начала"
            date={startDate}
            setDate={setStartDate}
          />
          <ChooseDateInput
            label="Дата окончания"
            date={endDate}
            setDate={setEndDate}
          />
        </div>
        <button className={styles.search} onClick={handleSearch}>
          Поиск
        </button>
      </div>

      {isLoadingEvents && <p>Загрузка мероприятий...</p>}
      {errorEvents && <p>Произошла ошибка при загрузке данных мероприятий.</p>}

      {isLoadingSports && <p>Загрузка видов спорта...</p>}
      {errorSports && <p>Произошла ошибка при загрузке данных видов спорта.</p>}

      {isLoadingLocations && <p>Загрузка локаций...</p>}
      {errorLocations && <p>Произошла ошибка при загрузке данных локаций.</p>}
    </div>
  );
};

export default FilterForm;
