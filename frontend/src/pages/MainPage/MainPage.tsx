import { useState, useEffect } from "react";
import { MiniCartSportEvent } from "../../shared/ui/components/MiniCardSportEvent";
import { FilterForm } from "../../features/Filter/ui/FilterForm";
import { useSportEvents } from "../../shared/api/events";
import styles from "./mainpage.module.scss";
import { getEventStatus } from "../../shared/utils/getEventStatus";
import { News } from "../../shared/ui/components/News";

// Функция для получения текущей даты в формате YYYY-MM-DD
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Берём только дату без времени
};

export const MainPage = () => {
  const size = 9; // Количество элементов на странице
  const [isMobile, setIsMobile] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    size,
    sports: [],
    categories: [],
    competitions: [],
    cities: [],
    participant_type: "",
    participant_from: undefined,
    participant_to: undefined,
    participants_count: undefined,
    start_date: getCurrentDate(),
    end_date: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { data, isLoading, error } = useSportEvents(filters);

  const handleNextPage = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: prevFilters.page + 1,
    }));
  };

  const handlePrevPage = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: Math.max(prevFilters.page - 1, 1),
    }));
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
      page: 1, // Сбрасываем страницу при изменении фильтров
    }));
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error instanceof Error) {
    return <div>Ошибка: {error.message}</div>;
  }

  return (
    <div className={styles.mainPage}>
      <h1 className={styles.title}>
        <span className={styles.unique}>ЕДИНЫЙ</span> КАЛЕНДАРНЫЙ ПЛАН
        ФИЗКУЛЬТУРНЫХ
        <br /> И СПОРТИВНЫХ МЕРОПРИЯТИЙ
      </h1>
      <News />
      <FilterForm onFilterChange={handleFilterChange} />
      <div className={styles.miniCards}>
        {data?.items.map((event) => {
          const { status, statusColor } = getEventStatus(
            event.start_date,
            event.end_date
          );
          return (
            <center className={styles.card} key={event.id}>
              <MiniCartSportEvent
                data={event}
                statusColor={statusColor}
                status={status}
                isMobile={isMobile}
              />
            </center>
          );
        })}
      </div>
      <div className={styles.pagination}>
        <button
          onClick={handlePrevPage}
          disabled={filters.page === 1}
          className={styles.paginationButton}
        >
          Предыдущая страница
        </button>
        <span className={styles.pageInfo}>Страница: {filters.page}</span>
        <button
          onClick={handleNextPage}
          disabled={data && data.items.length < size}
          className={styles.paginationButton}
        >
          Следующая страница
        </button>
      </div>
    </div>
  );
};

export default MainPage;
