import { MiniCartSportEvent } from "../../shared/ui/components/MiniCardSportEvent/";
import { FilterForm } from "../../features/Filter/ui/FilterForm";
import { useSportEvents } from "../../shared/api/events";
import styles from "./mainpage.module.scss";
import { getEventStatus } from "../../shared/utils/getEventStatus";
import { News } from "../../shared/ui/components/News";

export const MainPage = () => {
  const page = 1; // Страница по умолчанию
  const size = 20; // Размер страницы

  // Используем хук для запроса данных
  const { data, isLoading, error } = useSportEvents(page, size);

  // Показать загрузку или ошибку
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
              data={event}
              statusColor={statusColor}
              status={status}
            />
          );
        })}
      </div>
    </>
  );
};

export default MainPage;
