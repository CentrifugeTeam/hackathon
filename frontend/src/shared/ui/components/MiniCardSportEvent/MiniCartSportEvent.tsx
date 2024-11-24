import React from "react";
import styles from "./MiniCartSportEvent.module.scss";
import { formatDateRange } from "../../../utils/formatDateRange";

interface CartSportEventProps {
  data: {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    participants_count: number;
    city: string;
    sport: string;
  };
  statusColor: string;
  status: string;
	isMobile: boolean;
}

export const MiniCartSportEvent: React.FC<CartSportEventProps> = ({
  data,
  statusColor,
  status,
	isMobile
}) => {
  return (
    <div className={`${styles.card} ${isMobile ? styles.mobile : ''}`}>
      <div className={styles.headerCard}>
        <p className={styles.eventStatus} style={{ background: statusColor }}>
          {status}
        </p>
        <p>СПОРТИВНЫЕ</p>
      </div>
      {/* Название события */}
      <h3 className={styles.eventName}>{data.name}</h3>

      <h4 className={`${styles.eventText} ${styles.eventSubTitle}`}>
        {data.name}
      </h4>

      {/* Вид спорта */}
      <h4 className={styles.typeEvent}>
        <span className={styles.eventText}>ВИД СПОРТА: </span>
        {data.sport || "Тип спорта недоступен"}
      </h4>

      {/* Количество участников */}
      <h4 className={styles.participantsCount}>
        {data.participants_count} УЧАСТНИКОВ
      </h4>

      <hr className={styles.hr} style={{ color: statusColor }} />

      {/* Локация (город + даты) */}
      <h4 className={styles.location}>
        {data.city
          ? `${data.city}, ${formatDateRange(data.start_date, data.end_date)}`
          : "Локация недоступна"}
      </h4>

      {/* ID события */}
      <h4 className={styles.id}>№ ЕКП {data.id}</h4>
    </div>
  );
};
