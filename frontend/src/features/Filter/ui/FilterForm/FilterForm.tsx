import { useState, useEffect } from "react";
import { useEvents } from "../../api/eventName";
import { useSportEvents } from "../../api/sportName";
import { useLocationEvents } from "../../api/locationName";
import { MultiSelectDropdown } from "../../../../shared/ui/components/MultiSelectDropdown";
import styles from "./filterform.module.scss";
import { ChooseSexDropdown } from "../../../../shared/ui/components/ChooseSexDropdown";
// import { ChooseAgeInput } from "../../../../shared/ui/components/ChooseAgeInput";
import { ChooseMemberCount } from "../../../../shared/ui/components/ChooseMemberCount";
import { ChooseDateInput } from "../../../../shared/ui/components/ChooseDateInput";
import { useSexEvents } from "../../api/sexName";
import { useCompetitionEvents } from "../../api/competitionName";
import Cookies from "js-cookie";

const calculateEndDate = (sortPeriod: string): string => {
	const currentDate = new Date();
	let calculatedEndDate = new Date(currentDate);

	// Изменение месяца в зависимости от выбранного периода
	if (sortPeriod === "1") {
		calculatedEndDate.setMonth(currentDate.getMonth() + 1); // 1 месяц
	} else if (sortPeriod === "3") {
		calculatedEndDate.setMonth(currentDate.getMonth() + 3); // 3 месяца
	} else if (sortPeriod === "6") {
		calculatedEndDate.setMonth(currentDate.getMonth() + 6); // 6 месяцев
	}

	return calculatedEndDate.toISOString().split("T")[0]; // Возвращаем дату в формате YYYY-MM-DD
};

export const FilterForm = ({
  onFilterChange,
}: {
  onFilterChange: (filters: Record<string, any>) => void;
}) => {
  const [isFilterVisible, setFilterVisible] = useState(false);

  // Состояния фильтров
  const [multiSelectEventName, setMultiSelectEventName] = useState<string[]>(
    []
  );
  const [multiSelectSportType, setMultiSelectSportType] = useState<string[]>(
    []
  );
  const [multiSelectValues3, setMultiSelectValues3] = useState<string[]>([]); // Дисциплина
  const [multiSelectValues4, setMultiSelectValues4] = useState<string[]>([]); // Место проведения
  const [multiSelectValues5, setMultiSelectValues5] = useState<string[]>([]); // Программа

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sexQuery, setSexQuery] = useState<string>("");
  const [sex, setSex] = useState<string[]>([]);
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [memberCount, setMemberCount] = useState<string>("");
  const [sortPeriod, setSortPeriod] = useState<string>(""); // Значение по умолчанию - 1 месяц

  const handleSearch = () => {
		const endDateCalculated = calculateEndDate(sortPeriod);


    const filters = {
      sports: multiSelectSportType.join(","),
      competitions: multiSelectValues5.join(","),
      categories: multiSelectValues3.join(","),
      cities: multiSelectValues4.join(","),
      start_date: startDate || new Date().toISOString().split("T")[0],
      end_date: endDateCalculated,
      sex: sex.join(","),
      min_age: minAge,
      max_age: maxAge,
      member_count: memberCount,
    };

    onFilterChange(filters);

    const formData = {
      eventNames: multiSelectEventName,
      sportTypes: multiSelectSportType,
      disciplines: multiSelectValues3,
      locations: multiSelectValues4,
      programs: multiSelectValues5,
      sex,
      minAge,
      maxAge,
      startDate,
      endDate: endDateCalculated,
      memberCount,
      sortPeriod,
    };

    Cookies.set("filterData", JSON.stringify(formData), { expires: 7 });
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
    // После очистки фильтров удаляем их из cookies
    Cookies.remove("filterData");
  };

  // Загрузка фильтров из cookies при монтировании компонента
  useEffect(() => {
    const savedFilters = Cookies.get("filterData");

    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);

      // Проверка и установка значений для разных фильтров
      setMultiSelectEventName(
        Array.isArray(parsedFilters.eventNames)
          ? parsedFilters.eventNames
          : parsedFilters.eventNames
          ? parsedFilters.eventNames.split(",")
          : []
      );
      setMultiSelectSportType(
        Array.isArray(parsedFilters.sportTypes)
          ? parsedFilters.sportTypes
          : parsedFilters.sportTypes
          ? parsedFilters.sportTypes.split(",")
          : []
      );
      setMultiSelectValues3(
        Array.isArray(parsedFilters.disciplines)
          ? parsedFilters.disciplines
          : parsedFilters.disciplines
          ? parsedFilters.disciplines.split(",")
          : []
      );
      setMultiSelectValues4(
        Array.isArray(parsedFilters.locations)
          ? parsedFilters.locations
          : parsedFilters.locations
          ? parsedFilters.locations.split(",")
          : []
      );
      setMultiSelectValues5(
        Array.isArray(parsedFilters.programs)
          ? parsedFilters.programs
          : parsedFilters.programs
          ? parsedFilters.programs.split(",")
          : []
      );

      // Для "sex" нужно дополнительно проверять тип данных
      if (parsedFilters.sex) {
        // Если "sex" уже строка, то разделяем её, если массив - сразу используем его
        setSex(
          typeof parsedFilters.sex === "string"
            ? parsedFilters.sex.split(",")
            : Array.isArray(parsedFilters.sex)
            ? parsedFilters.sex
            : [] // Если ни строка, ни массив, то пустой массив
        );
      } else {
        setSex([]); // Если "sex" нет в cookies, устанавливаем пустой массив
      }

      setMinAge(parsedFilters.minAge || "");
      setMaxAge(parsedFilters.maxAge || "");
      setStartDate(parsedFilters.startDate || "");
      setEndDate(parsedFilters.endDate || "");
      setMemberCount(parsedFilters.memberCount || "");
			setSortPeriod(parsedFilters.sortPeriod || "");

			const calculatedEndDate = parsedFilters.endDate || calculateEndDate(parsedFilters.sortPeriod || "");
			setStartDate(parsedFilters.startDate || new Date().toISOString().split("T")[0]);
      setEndDate(calculatedEndDate);
    }
  }, []);

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
          setValue={setMultiSelectValues3}
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
          setValue={setMultiSelectValues5}
          options={programOptions}
          fetchMoreOptions={() => {}}
          hasNextPage={false}
          onSearch={setSearchQuery}
        />
        <div className={styles.sort}>
          <label>Сортировать по периоду:</label>
          <div className={styles.sortButtons}>
            <button
              className={sortPeriod === "1" ? styles.active : ""}
              onClick={() => setSortPeriod("1")}
            >
              1 месяц
            </button>
            <button
              className={sortPeriod === "3" ? styles.active : ""}
              onClick={() => setSortPeriod("3")}
            >
              3 месяца
            </button>
            <button
              className={sortPeriod === "6" ? styles.active : ""}
              onClick={() => setSortPeriod("6")}
            >
              6 месяцев
            </button>
          </div>
        </div>
        <div className={styles.inputs_flex}>
          <ChooseSexDropdown
            label="Выберите пол"
            value={sex}
            setValue={setSex}
            options={sexOptions}
            onSearch={setSexQuery}
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
