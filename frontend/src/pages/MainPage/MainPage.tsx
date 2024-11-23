import { useEffect, useState } from "react";
import { MiniCartSportEvent } from "../../shared/ui/components/MiniCardSportEvent/MiniCartSportEvent";
import { CartSportEvent } from "../../shared/ui/components/CartSportEvent";
import { FilterForm } from "../../features/Filter/ui/FilterForm";
import { events } from "../../shared/api/getSportEvents"; // Импортируем данные
import styles from "./mainpage.module.scss";
import { getEventStatus } from "../../shared/utils/getEventStatus";
import { News } from "../../shared/ui/components/News";
import { ICartSportEvent } from "../../shared/interfaces";

export const MainPage = () => {
  const [data, setData] = useState<ICartSportEvent[]>(events); // Используем примерные события

  useEffect(() => {
    // запросы
  }, []);

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
        {data.map((event) => {
					const { status, statusColor } = getEventStatus(event.start_date, event.end_date);
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
