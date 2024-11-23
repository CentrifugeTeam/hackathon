import { useState } from "react";
import { MiniCartSportEvent } from "../../shared/ui/components/MiniCardSportEvent";
import { FilterForm } from "../../features/Filter/ui/FilterForm";
import { useSportEvents } from "../../shared/api/events";
import styles from "./mainpage.module.scss";
import { getEventStatus } from "../../shared/utils/getEventStatus";
import { News } from "../../shared/ui/components/News";

export const MainPage = () => {
  const [page, setPage] = useState(1); // Страница по умолчанию
  const size = 20; // Размер страницы

  // Используем хук для запроса данных
  const { data, isLoading, error } = useSportEvents(page, size);

  // Обработчики для кнопок пагинации
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error instanceof Error) {
    return <div>Ошибка: {error.message}</div>;
  }

  return (
    <>
      <h1 className={styles.title}>
        <span className={styles.unique}>ЕДИНЫЙ</span> КАЛЕНДАРЬ ПЛАН
        ФИЗКУЛЬТУРНЫХ
        <br /> И СПОРТИВНЫХ МЕРОПРИЯТИЙ
      </h1>
      <News />
      <FilterForm />
      <div className={styles.miniCards}>
        {data?.items.map((event) => {
          const { status, statusColor } = getEventStatus(
            event.start_date,
            event.end_date
          );
          return (
            <MiniCartSportEvent
              key={event.id}
              data={{
                id: event.id,
                name: event.name,
                start_date: event.start_date,
                end_date: event.end_date,
                participants_count: event.participants_count,
                city: event.city,
                sport: event.sport,
              }}
              statusColor={statusColor}
              status={status}
            />
          );
        })}
      </div>
      <div className={styles.pagination}>
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className={styles.paginationButton}
        >
          Предыдущая страница
        </button>
        <span className={styles.pageInfo}>Страница: {page}</span>
        <button
          onClick={handleNextPage}
          disabled={data && data.items.length < size}
          className={styles.paginationButton}
        >
          Следующая страница
        </button>
      </div>
    </>
  );
};

export default MainPage;
